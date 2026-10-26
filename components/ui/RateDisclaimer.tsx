// One-line rate disclaimer. 14px (meta-d) so it clears the `text/muted ≥14pt`
// floor at every viewport. Rendered on the property page and reused as the
// PropertyCard hover footnote.

export function RateDisclaimer({ className }: { className?: string }) {
  return (
    <p className={"text-meta-d text-text-muted " + (className ?? "")}>
      Prices are indicative and subject to change. Confirm current rates, availability and charges
      with the advisor before any commitment.
    </p>
  );
}
