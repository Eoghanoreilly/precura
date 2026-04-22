export function getSeasonalContext(): { title: string; body: string } {
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) {
    return {
      title: "Spring is here",
      body: "With longer days returning, your vitamin D should continue climbing naturally. Outdoor activity also supports your metabolic markers.",
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      title: "Summer in Sweden",
      body: "Peak sunlight months. Your vitamin D will be at its highest naturally. A good time to establish outdoor routines that carry into autumn.",
    };
  }
  if (month >= 9 && month <= 10) {
    return {
      title: "Autumn approaching",
      body: "As daylight drops, consider starting a D3 supplement. Your next panel will show how your levels respond to the seasonal shift.",
    };
  }
  return {
    title: "Winter in Sweden",
    body: "Limited daylight means your vitamin D may drop. A daily D3 supplement (1000-2000 IU) helps maintain levels through the dark months.",
  };
}
