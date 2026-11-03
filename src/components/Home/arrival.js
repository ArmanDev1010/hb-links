// Shared by the scroll-played heroes (HeroIntro, HeroBuildSequence).

// Whether this hero's page was reached by a link inside the site — not
// loaded, reloaded, or come back to with Back/Forward. Asked once per page:
// a link followed since the last hero, or, for the first hero shown (it may
// load with a later page), a page other than the one loaded.
let followedLink = false;
let firstHero = true;
if (typeof window !== "undefined") {
  window.addEventListener(
    "click",
    (event) => event.target.closest?.("a[href]") && (followedLink = true),
    true,
  );
  window.addEventListener("popstate", () => (followedLink = false));
}
export function reachedByLink() {
  const page = (url) => url?.split("#")[0];
  const loaded = performance.getEntriesByType?.("navigation")[0]?.name;
  const answer =
    followedLink || (firstHero && page(loaded) !== page(location.href));
  followedLink = false;
  firstHero = false;
  return answer;
}
