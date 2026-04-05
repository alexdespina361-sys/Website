"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useToast } from "@/components/ToastProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { ShippingAddress } from "@/lib/types";
import {
  createEmptyShippingAddress,
  formatShippingAddressLines,
  normalizeShippingAddressDraft,
  type ShippingAddressDraft,
} from "@/lib/shipping-addresses";

export default function CheckoutButton() {
  const { items } = useCart();
  const { showToast } = useToast();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [contactEmail, setContactEmail] = useState("");
  const [draftAddress, setDraftAddress] = useState<ShippingAddressDraft>(
    createEmptyShippingAddress()
  );

  useEffect(() => {
    let active = true;

    async function loadCheckoutContext() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      setIsLoggedIn(Boolean(user));
      setContactEmail(user?.email || "");

      const recipientName = user?.user_metadata.full_name || "";
      setDraftAddress((current) =>
        current.recipient_name
          ? current
          : createEmptyShippingAddress(recipientName)
      );

      if (!user) {
        setUseNewAddress(true);
        return;
      }

      const { data: addresses, error } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true });

      if (!active) {
        return;
      }

      if (error) {
        showToast({
          title: "Adrese indisponibile",
          description: error.message,
          tone: "error",
        });
        return;
      }

      const normalizedAddresses = addresses || [];
      setSavedAddresses(normalizedAddresses);

      if (normalizedAddresses.length > 0) {
        setSelectedAddressId(normalizedAddresses[0].id);
        setUseNewAddress(false);
        setSaveAddress(false);
      } else {
        setUseNewAddress(true);
        setSaveAddress(true);
      }
    }

    void loadCheckoutContext();

    return () => {
      active = false;
    };
  }, [showToast, supabase]);

  const selectedAddress = savedAddresses.find(
    (address) => address.id === selectedAddressId
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      return;
    }

    const normalizedEmail = contactEmail.trim();

    if (!normalizedEmail) {
      showToast({
        title: "Email necesar",
        description: "Completeaza un email de contact pentru comanda.",
        tone: "error",
      });
      return;
    }

    const normalizedAddress = normalizeShippingAddressDraft(draftAddress);
    const usingSavedAddress = isLoggedIn && !useNewAddress && selectedAddressId;

    if (
      !usingSavedAddress &&
      (!normalizedAddress.recipient_name ||
        !normalizedAddress.address_line1 ||
        !normalizedAddress.city ||
        !normalizedAddress.country)
    ) {
      showToast({
        title: "Adresa incompleta",
        description:
          "Completeaza destinatarul, adresa, orasul si tara inainte de confirmarea comenzii.",
        tone: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "cash_on_delivery",
          contactEmail: normalizedEmail,
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          shippingAddressId: usingSavedAddress ? selectedAddressId : null,
          shippingAddress: usingSavedAddress ? null : normalizedAddress,
          selectedShippingAddress:
            usingSavedAddress && selectedAddress
              ? {
                  label: selectedAddress.label,
                  recipient_name: selectedAddress.recipient_name,
                  phone: selectedAddress.phone || "",
                  address_line1: selectedAddress.address_line1,
                  address_line2: selectedAddress.address_line2 || "",
                  city: selectedAddress.city,
                  region: selectedAddress.region || "",
                  postal_code: selectedAddress.postal_code || "",
                  country: selectedAddress.country,
                  is_default: selectedAddress.is_default,
                }
              : null,
          saveAddress:
            isLoggedIn && useNewAddress ? Boolean(saveAddress) : false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu am putut confirma comanda.");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      throw new Error("Raspuns de checkout neasteptat.");
    } catch (error) {
      showToast({
        title: "Checkout indisponibil",
        description:
          error instanceof Error
            ? error.message
            : "Incearca din nou in cateva momente.",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 font-label text-[10px] uppercase tracking-[0.2em] text-outline">
          Contact
        </h4>
        <input
          className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          placeholder="adresa@email.com"
        />
      </div>

      <div className="border border-outline-variant/30 bg-surface-container-lowest p-4">
        <h4 className="font-label text-[10px] uppercase tracking-[0.2em]">
          Metoda de plata
        </h4>
        <p className="mt-2 font-body text-sm text-secondary">
          Plata se face exclusiv ramburs, la primirea coletului.
        </p>
      </div>

      <div className="border-t border-outline-variant/20 pt-8">
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
            Adresa de livrare
          </h4>
          {isLoggedIn && savedAddresses.length > 0 ? (
            <button
              type="button"
              onClick={() => setUseNewAddress((current) => !current)}
              className="font-label text-[9px] uppercase tracking-[0.2em] text-outline transition-colors hover:text-primary"
            >
              {useNewAddress ? "Foloseste o adresa salvata" : "Alta adresa"}
            </button>
          ) : null}
        </div>

        {isLoggedIn && !useNewAddress && savedAddresses.length > 0 ? (
          <div className="mt-4 space-y-3">
            {savedAddresses.map((address) => (
              <button
                key={address.id}
                type="button"
                onClick={() => setSelectedAddressId(address.id)}
                className={`w-full border p-4 text-left transition-colors ${
                  selectedAddressId === address.id
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant/30 bg-surface-container-lowest"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                      {address.label}
                    </p>
                    {address.is_default ? (
                      <span className="mt-2 inline-block bg-primary/10 px-3 py-1 font-label text-[9px] uppercase tracking-[0.2em] text-primary">
                        Implicita
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  {formatShippingAddressLines({
                    recipient_name: address.recipient_name,
                    phone: address.phone || "",
                    address_line1: address.address_line1,
                    address_line2: address.address_line2 || "",
                    city: address.city,
                    region: address.region || "",
                    postal_code: address.postal_code || "",
                    country: address.country,
                  }).map((line) => (
                    <p key={line} className="font-body text-sm text-secondary">
                      {line}
                    </p>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {isLoggedIn ? null : (
              <p className="font-body text-sm text-secondary">
                <Link href="/login" className="text-primary hover:underline">
                  Intra in cont
                </Link>{" "}
                pentru a salva si reutiliza adresele de livrare.
              </p>
            )}
            <div className="grid grid-cols-1 gap-6">
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                type="text"
                value={draftAddress.label}
                onChange={(event) =>
                  setDraftAddress((current) => ({
                    ...current,
                    label: event.target.value,
                  }))
                }
                placeholder="Eticheta adresa"
              />
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                type="text"
                value={draftAddress.recipient_name}
                onChange={(event) =>
                  setDraftAddress((current) => ({
                    ...current,
                    recipient_name: event.target.value,
                  }))
                }
                placeholder="Nume destinatar"
              />
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                type="tel"
                value={draftAddress.phone}
                onChange={(event) =>
                  setDraftAddress((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Telefon"
              />
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                type="text"
                value={draftAddress.address_line1}
                onChange={(event) =>
                  setDraftAddress((current) => ({
                    ...current,
                    address_line1: event.target.value,
                  }))
                }
                placeholder="Adresa"
              />
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                type="text"
                value={draftAddress.address_line2}
                onChange={(event) =>
                  setDraftAddress((current) => ({
                    ...current,
                    address_line2: event.target.value,
                  }))
                }
                placeholder="Apartament, interfon, reper"
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draftAddress.city}
                  onChange={(event) =>
                    setDraftAddress((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  placeholder="Oras"
                />
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draftAddress.region}
                  onChange={(event) =>
                    setDraftAddress((current) => ({
                      ...current,
                      region: event.target.value,
                    }))
                  }
                  placeholder="Judet / Regiune"
                />
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draftAddress.postal_code}
                  onChange={(event) =>
                    setDraftAddress((current) => ({
                      ...current,
                      postal_code: event.target.value,
                    }))
                  }
                  placeholder="Cod postal"
                />
              </div>
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                type="text"
                value={draftAddress.country}
                onChange={(event) =>
                  setDraftAddress((current) => ({
                    ...current,
                    country: event.target.value,
                  }))
                }
                placeholder="Tara"
              />
            </div>

            {isLoggedIn ? (
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    className="h-4 w-4 rounded-none border-outline-variant text-primary focus:ring-primary"
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(event) => setSaveAddress(event.target.checked)}
                  />
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                    Salveaza aceasta adresa in cont
                  </span>
                </label>
                {saveAddress ? (
                  <label className="flex items-center gap-3">
                    <input
                      className="h-4 w-4 rounded-none border-outline-variant text-primary focus:ring-primary"
                      type="checkbox"
                      checked={draftAddress.is_default}
                      onChange={(event) =>
                        setDraftAddress((current) => ({
                          ...current,
                          is_default: event.target.checked,
                        }))
                      }
                    />
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                      Foloseste ca adresa implicita
                    </span>
                  </label>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="btn-hover-effect block w-full bg-primary py-5 text-center font-label text-xs uppercase tracking-widest text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:bg-primary-container hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Se proceseaza..." : "Confirma comanda cu ramburs"}
      </button>

      <p className="font-body text-xs leading-relaxed text-secondary">
        Comanda este creata imediat, iar plata se face la livrare. Vei primi
        confirmarea prin email si o vei vedea direct in cont daca esti
        autentificat.
      </p>

      {selectedAddress ? (
        <p className="font-body text-xs leading-relaxed text-secondary">
          Adresa selectata va fi folosita automat pentru livrare la aceasta
          comanda.
        </p>
      ) : null}
    </div>
  );
}
