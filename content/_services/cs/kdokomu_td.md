---
title: "Kdo komu co dělá"
weight: 1
year: 2026
date: 2026-01-08
group_development: "typický vývoj"
group_age: "1. a 2. třída"
active: true
lang: cs
---
{% assign lang = page.lang | default: 'en' %}
{% assign labels = site.data.labels[lang] %}

<a href="#" class="btn-custom btn-disabled">
  {{ labels.bookings_unavailable }}
</a>

# Podrobné informace
<embed src="../../../../assets/pdf/participant_info/Informace_kdo_komu_co.pdf#view=fitH" style="width: 100%; height: 100vh;" type="application/pdf">

