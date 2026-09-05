"use client";

import { useState } from "react";
import Image from "next/image";

import {
  MapPin,
  Star,
  BadgeCheck,
  Heart,
  Users,
  Wifi,
  Snowflake,
} from "lucide-react";

export interface AvailableTag {
  type: "capacity" | "wifi" | "ac";
  label: string;
}

export interface CardAvailableProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  location: string;
  distanceKm?: number;
  rating: number;
  verified?: boolean;
  tags?: AvailableTag[];
  price: number;
  priceUnit?: string;
  favorited?: boolean;
  onToggleFavorite?: (next: boolean) => void;
  onPesan?: () => void;
}

export const availableTagPresets = {
  capacity: (label: string): AvailableTag => ({
    type: "capacity",
    label,
  }),

  wifi: (label = "WiFi"): AvailableTag => ({
    type: "wifi",
    label,
  }),

  ac: (label = "AC"): AvailableTag => ({
    type: "ac",
    label,
  }),
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CardAvailable({
  imageSrc,
  imageAlt = "",
  title,
  location,
  distanceKm,
  rating,
  verified = true,
  tags = [],
  price,
  priceUnit = "sesi",
  favorited = false,
  onToggleFavorite,
  onPesan,
}: CardAvailableProps) {
  const [isFavorited, setIsFavorited] = useState(favorited);

  const handleFavoriteClick = () => {
    const next = !isFavorited;
    setIsFavorited(next);
    onToggleFavorite?.(next);
  };

  return (
    <div className="flex w-full max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="relative w-2/5 shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt || title}
          fill
          className="object-cover"
        />

        {verified && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <BadgeCheck className="w-3.5 h-3.5" />
            Terverifikasi
          </span>
        )}

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={
            isFavorited ? "Hapus dari favorit" : "Tambahkan ke favorit"
          }
          className="absolute bottom-3 left-3 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Heart
            className={
              isFavorited
                ? "w-4 h-4 fill-rose-500 text-rose-500"
                : "w-4 h-4 text-gray-500"
            }
          />
        </button>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>

          <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5" />

          <span>
            {location}
            {distanceKm != null ? ` - ${distanceKm} km` : ""}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {tags.map((tag) => {
              let Icon;

              if (tag.type === "capacity") {
                Icon = Users;
              } else if (tag.type === "wifi") {
                Icon = Wifi;
              } else {
                Icon = Snowflake;
              }

              return (
                <span
                  key={tag.label}
                  className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tag.label}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">
              {formatRupiah(price)}
            </span>{" "}
            <span className="text-gray-500">/ {priceUnit}</span>
          </div>

          <button
            type="button"
            onClick={onPesan}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-5 py-2 transition-colors"
          >
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}