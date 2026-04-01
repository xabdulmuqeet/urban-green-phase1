type WeatherLookup = {
  postalCode: string;
  temperatureF: number | null;
  latitude: number;
  longitude: number;
  locationLabel: string | null;
};

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export function isWeatherConfigured() {
  return Boolean(OPENWEATHER_API_KEY);
}

export async function lookupWeatherByPostalCode(postalCode: string): Promise<WeatherLookup> {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("Missing OPENWEATHER_API_KEY environment variable.");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${encodeURIComponent(postalCode)},US&units=imperial&appid=${OPENWEATHER_API_KEY}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Unable to look up weather for that zip code.");
  }

  const payload = (await response.json()) as {
    coord?: { lat?: number; lon?: number };
    main?: { temp?: number };
    name?: string;
  };

  if (typeof payload.coord?.lat !== "number" || typeof payload.coord?.lon !== "number") {
    throw new Error("Weather lookup did not return destination coordinates.");
  }

  return {
    postalCode,
    temperatureF: typeof payload.main?.temp === "number" ? payload.main.temp : null,
    latitude: payload.coord.lat,
    longitude: payload.coord.lon,
    locationLabel: payload.name ?? null
  };
}
