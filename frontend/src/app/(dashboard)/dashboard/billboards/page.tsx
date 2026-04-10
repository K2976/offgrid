'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Star, TrendingUp, DollarSign, Users, Eye, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const MarkerComp = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

const billboards = [
  { id: '1', name: 'Times Square Digital', lat: 40.758, lng: -73.9855, areaType: 'Commercial Hub', nearbyPlaces: ['Broadway', 'Subway Station', 'Retail Stores'], aiScore: 95, recommendation: 'Premium location — ideal for brand awareness campaigns targeting tourists and commuters.', monthlyRate: 45000, size: '48x14 ft', city: 'New York' },
  { id: '2', name: 'Sunset Blvd Billboard', lat: 34.0982, lng: -118.3295, areaType: 'Entertainment District', nearbyPlaces: ['Hollywood', 'Restaurants', 'Studios'], aiScore: 88, recommendation: 'High visibility among entertainment and creative professionals. Great for product launches.', monthlyRate: 28000, size: '36x12 ft', city: 'Los Angeles' },
  { id: '3', name: 'Michigan Ave Display', lat: 41.8827, lng: -87.6233, areaType: 'Shopping District', nearbyPlaces: ['Magnificent Mile', 'Hotels', 'Retail'], aiScore: 82, recommendation: 'Strong foot traffic from shoppers. Best for retail and e-commerce brands.', monthlyRate: 18000, size: '24x10 ft', city: 'Chicago' },
  { id: '4', name: 'Market Street LED', lat: 37.7849, lng: -122.4094, areaType: 'Tech Corridor', nearbyPlaces: ['Tech HQs', 'Transit Hub', 'Convention Center'], aiScore: 91, recommendation: 'Perfect for B2B SaaS and tech brands. High density of decision-makers.', monthlyRate: 32000, size: '40x14 ft', city: 'San Francisco' },
  { id: '5', name: 'South Beach Panel', lat: 25.7825, lng: -80.1340, areaType: 'Tourism Zone', nearbyPlaces: ['Beach', 'Nightlife', 'Hotels'], aiScore: 76, recommendation: 'Seasonal peak in winter months. Good for lifestyle and travel brands.', monthlyRate: 15000, size: '20x8 ft', city: 'Miami' },
  { id: '6', name: 'Downtown Austin Wall', lat: 30.2672, lng: -97.7431, areaType: 'Cultural District', nearbyPlaces: ['Live Music Venues', 'Startups', 'Universities'], aiScore: 84, recommendation: 'Young, tech-savvy audience. Ideal for app launches and startup awareness.', monthlyRate: 12000, size: '30x12 ft', city: 'Austin' },
];

const topRecommended = billboards.sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);

export default function BillboardsPage() {
  const [selected, setSelected] = useState(billboards[0]);
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [LeafIcon, setLeafIcon] = useState<any>(null);

  React.useEffect(() => {
    import('leaflet').then((L) => {
      setLeafIcon(
        new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    });
    // Import leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }, []);

  const scoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-zinc-400';
  };

  return (
    <div>
      <Header title="Billboards" subtitle="Find the best outdoor advertising locations" />

      <div className="mt-6 space-y-6 px-8 pb-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-white/[0.08] bg-white/[0.03] p-1">
            {['all', 'under-15k', '15k-30k', '30k+'].map((b) => (
              <button key={b} onClick={() => setBudgetFilter(b)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${budgetFilter === b ? 'bg-brand-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                {b === 'all' ? 'All Budgets' : b === 'under-15k' ? 'Under $15K' : b === '15k-30k' ? '$15K-$30K' : '$30K+'}
              </button>
            ))}
          </div>
        </div>

        {/* Map + Detail */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Map */}
          <Card className="overflow-hidden border-white/[0.06] bg-surface-100 p-0">
            <div className="h-[480px]">
              {typeof window !== 'undefined' && LeafIcon && (
                <MapContainer
                  center={[39.8283, -98.5795]}
                  zoom={4}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {billboards.map((b) => (
                    <MarkerComp
                      key={b.id}
                      position={[b.lat, b.lng]}
                      icon={LeafIcon}
                      eventHandlers={{ click: () => setSelected(b) }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{b.name}</strong><br />
                          Score: {b.aiScore}/100
                        </div>
                      </Popup>
                    </MarkerComp>
                  ))}
                </MapContainer>
              )}
            </div>
          </Card>

          {/* Detail Panel */}
          <div className="space-y-4">
            <Card className="border-white/[0.06] bg-surface-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="h-5 w-5 text-brand-400" />
                  {selected.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] p-3">
                  <span className="text-sm text-zinc-400">AI Score</span>
                  <span className={`text-2xl font-bold ${scoreColor(selected.aiScore)}`}>
                    {selected.aiScore}<span className="text-sm text-zinc-600">/100</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Area Type</span>
                    <span className="text-zinc-200">{selected.areaType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Size</span>
                    <span className="text-zinc-200">{selected.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Monthly Rate</span>
                    <span className="font-semibold text-white">${selected.monthlyRate.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">City</span>
                    <span className="text-zinc-200">{selected.city}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-zinc-500">Nearby Places</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.nearbyPlaces.map((p) => (
                      <span key={p} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-zinc-400">{p}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    <span className="text-xs font-medium text-violet-300">AI Recommendation</span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">{selected.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top 3 Recommended */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Star className="h-5 w-5 text-amber-400" />
            Top Recommended Locations
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {topRecommended.map((b, i) => (
              <Card
                key={b.id}
                className="cursor-pointer border-white/[0.06] bg-surface-100 transition-all hover:border-white/[0.12] hover:shadow-lg"
                onClick={() => setSelected(b)}
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">#{i + 1}</Badge>
                    <span className={`text-lg font-bold ${scoreColor(b.aiScore)}`}>{b.aiScore}</span>
                  </div>
                  <h4 className="mb-1 font-semibold text-white">{b.name}</h4>
                  <p className="text-xs text-zinc-500">{b.city} · {b.areaType}</p>
                  <p className="mt-2 text-sm font-medium text-zinc-300">${b.monthlyRate.toLocaleString()}/mo</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
