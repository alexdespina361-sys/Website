"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";
import Icon from "@/components/Icon";
import type { ShippingAddress } from "@/lib/types";
import {
  createEmptyShippingAddress,
  formatShippingAddressLines,
  normalizeShippingAddressDraft,
  type ShippingAddressDraft,
} from "@/lib/shipping-addresses";

interface AddressBookProps {
  userId: string;
  defaultRecipientName: string;
}

export default function AddressBook({
  userId,
  defaultRecipientName,
}: AddressBookProps) {
  const { showToast } = useToast();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ShippingAddressDraft>(
    createEmptyShippingAddress(defaultRecipientName)
  );

  const syncProfileAddress = useCallback(
    async (address: ShippingAddressDraft | null) => {
      await supabase.from("profiles").upsert({
        id: userId,
        address: address
          ? formatShippingAddressLines(address).join(" · ")
          : null,
        updated_at: new Date().toISOString(),
      });
    },
    [supabase, userId]
  );

  const fetchAddresses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      setAddresses(data || []);
    } catch (error) {
      showToast({
        title: "Adrese indisponibile",
        description:
          error instanceof Error ? error.message : "Nu am putut încărca adresele.",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast, supabase, userId]);

  useEffect(() => {
    void fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (!showForm && !editingAddressId) {
      setDraft(createEmptyShippingAddress(defaultRecipientName));
    }
  }, [defaultRecipientName, editingAddressId, showForm]);

  const resetForm = () => {
    setShowForm(false);
    setEditingAddressId(null);
    setDraft(
      createEmptyShippingAddress(
        defaultRecipientName
      )
    );
  };

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setDraft({
      ...createEmptyShippingAddress(defaultRecipientName),
      is_default: addresses.length === 0,
    });
    setShowForm(true);
  };

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddressId(address.id);
    setDraft({
      label: address.label,
      recipient_name: address.recipient_name,
      phone: address.phone || "",
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      city: address.city,
      region: address.region || "",
      postal_code: address.postal_code || "",
      country: address.country,
      is_default: address.is_default,
    });
    setShowForm(true);
  };

  const clearDefaultFlags = async () => {
    const { error } = await supabase
      .from("shipping_addresses")
      .update({
        is_default: false,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const normalized = normalizeShippingAddressDraft(draft);

      if (
        !normalized.recipient_name ||
        !normalized.address_line1 ||
        !normalized.city ||
        !normalized.country
      ) {
        throw new Error("Completează numele, adresa, orașul și țara.");
      }

      if (normalized.is_default) {
        await clearDefaultFlags();
      }

      if (editingAddressId) {
        const { error } = await supabase
          .from("shipping_addresses")
          .update({
            ...normalized,
            phone: normalized.phone || null,
            address_line2: normalized.address_line2 || null,
            region: normalized.region || null,
            postal_code: normalized.postal_code || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAddressId)
          .eq("user_id", userId);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from("shipping_addresses").insert({
          user_id: userId,
          ...normalized,
          phone: normalized.phone || null,
          address_line2: normalized.address_line2 || null,
          region: normalized.region || null,
          postal_code: normalized.postal_code || null,
        });

        if (error) {
          throw error;
        }
      }

      if (normalized.is_default) {
        await syncProfileAddress(normalized);
      }

      await fetchAddresses();
      resetForm();
      showToast({
        title: editingAddressId ? "Adresă actualizată" : "Adresă salvată",
        description: "Adresa de livrare este gata pentru checkout.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Salvare eșuată",
        description:
          error instanceof Error ? error.message : "Nu am putut salva adresa.",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const makeDefault = async (address: ShippingAddress) => {
    try {
      await clearDefaultFlags();

      const { error } = await supabase
        .from("shipping_addresses")
        .update({
          is_default: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", address.id)
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      await syncProfileAddress({
        label: address.label,
        recipient_name: address.recipient_name,
        phone: address.phone || "",
        address_line1: address.address_line1,
        address_line2: address.address_line2 || "",
        city: address.city,
        region: address.region || "",
        postal_code: address.postal_code || "",
        country: address.country,
        is_default: true,
      });

      await fetchAddresses();
      showToast({
        title: "Adresă implicită actualizată",
        description: "Aceasta va fi folosită prima la checkout.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Actualizare eșuată",
        description:
          error instanceof Error
            ? error.message
            : "Nu am putut actualiza adresa implicită.",
        tone: "error",
      });
    }
  };

  const handleDelete = async (address: ShippingAddress) => {
    if (!window.confirm("Ștergi această adresă de livrare?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("shipping_addresses")
        .delete()
        .eq("id", address.id)
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      const remainingAddresses = addresses.filter((item) => item.id !== address.id);

      if (address.is_default) {
        if (remainingAddresses.length > 0) {
          const nextDefault = remainingAddresses[0];

          const { error: defaultError } = await supabase
            .from("shipping_addresses")
            .update({
              is_default: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", nextDefault.id)
            .eq("user_id", userId);

          if (defaultError) {
            throw defaultError;
          }

          await syncProfileAddress({
            label: nextDefault.label,
            recipient_name: nextDefault.recipient_name,
            phone: nextDefault.phone || "",
            address_line1: nextDefault.address_line1,
            address_line2: nextDefault.address_line2 || "",
            city: nextDefault.city,
            region: nextDefault.region || "",
            postal_code: nextDefault.postal_code || "",
            country: nextDefault.country,
            is_default: true,
          });

          await fetchAddresses();
        } else {
          await syncProfileAddress(null);
          await fetchAddresses();
        }
      } else {
        await fetchAddresses();
      }

      showToast({
        title: "Adresă ștearsă",
        description: "Adresa a fost eliminată din cont.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Ștergere eșuată",
        description:
          error instanceof Error ? error.message : "Nu am putut șterge adresa.",
        tone: "error",
      });
    }
  };

  return (
    <section className="mt-16 border-t border-outline-variant/20 pt-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="font-headline text-2xl">Adrese de Livrare</h4>
          <p className="mt-2 font-body text-sm text-secondary">
            Păstrează mai multe adrese și alege rapid varianta potrivită la checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewAddressForm}
          className="bg-primary px-6 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-primary-container"
        >
          Adaugă Adresă
        </button>
      </div>

      {loading ? (
        <p className="py-12 font-label text-xs uppercase tracking-widest text-outline">
          Se încarcă adresele...
        </p>
      ) : addresses.length === 0 ? (
        <div className="mt-8 bg-surface-container p-10 text-center">
          <Icon
            name="inventory"
            className="mx-auto mb-6 h-12 w-12 text-outline-variant"
          />
          <p className="font-label text-sm uppercase tracking-widest text-secondary">
            Nu ai nicio adresă salvată încă.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border p-8 transition-colors ${
                address.is_default
                  ? "border-primary bg-surface-container-lowest"
                  : "border-outline-variant/30 bg-surface-container-lowest"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.25em] text-outline">
                    {address.label}
                  </p>
                  {address.is_default ? (
                    <span className="mt-2 inline-block bg-primary/10 px-3 py-1 font-label text-[9px] uppercase tracking-[0.2em] text-primary">
                      Implicită
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-3">
                  {!address.is_default ? (
                    <button
                      type="button"
                      onClick={() => void makeDefault(address)}
                      className="font-label text-[9px] uppercase tracking-[0.2em] text-outline transition-colors hover:text-primary"
                    >
                      Implicită
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    className="text-outline transition-colors hover:text-primary"
                  >
                    <Icon name="edit" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(address)}
                    className="text-outline transition-colors hover:text-error"
                  >
                    <Icon name="delete" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-2">
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
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="mt-10 bg-surface-container-lowest p-10">
          <h5 className="font-headline text-2xl">
            {editingAddressId ? "Editează Adresa" : "Adresă Nouă"}
          </h5>
          <form className="mt-8" onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Etichetă
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.label}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Destinatar
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.recipient_name}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      recipient_name: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Telefon
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="tel"
                  value={draft.phone}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Țară
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.country}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      country: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Adresă
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.address_line1}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      address_line1: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Detalii suplimentare
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.address_line2}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      address_line2: event.target.value,
                    }))
                  }
                  placeholder="Apartament, interfon, reper"
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Oraș
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.city}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Județ / Regiune
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.region}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      region: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Cod Poștal
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm focus:border-primary focus:ring-0"
                  type="text"
                  value={draft.postal_code}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      postal_code: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    className="h-4 w-4 rounded-none border-outline-variant text-primary focus:ring-primary"
                    type="checkbox"
                    checked={draft.is_default}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        is_default: event.target.checked,
                      }))
                    }
                  />
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                    Adresă implicită
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 md:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary px-10 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-primary-container disabled:opacity-50"
              >
                {saving ? "Se salvează..." : "Salvează Adresa"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-surface-container px-10 py-4 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface transition-colors hover:bg-surface-container-highest"
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
