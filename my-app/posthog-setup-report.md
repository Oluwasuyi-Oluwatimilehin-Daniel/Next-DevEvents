# PostHog post-wizard report

The wizard has completed a targeted PostHog integration for this Next.js App Router project. Client-side PostHog initialization was moved to `instrumentation-client.ts`, a server-side PostHog helper was added in `lib/posthog-server.ts`, and a reverse-proxy ingest rewrite was configured in `next.config.ts`. The existing provider setup was retained for pageview capture, and new product analytics events were added for the featured events section, primary explore CTA, event card selection, and header navigation usage. Environment variables were written to `.env.local`, `posthog-node` was installed for server support, and the edited files were verified with scoped linting plus a production build.

| Event name | Description | File |
| --- | --- | --- |
| `featured_events_viewed` | Captures when the featured events section is rendered on the home page. | `app/page.tsx` |
| `explore_events_clicked` | Captures when the primary explore button is clicked to jump to featured events. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | Captures when a visitor selects a featured event card to learn more. | `components/EventCard.tsx` |
| `nav_link_clicked` | Captures when a visitor uses a primary navigation link. | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/513547/dashboard/1852532)
- Insight: [Featured events views (wizard)](https://us.posthog.com/project/513547/insights/ejTs3OiL)
- Insight: [Explore CTA clicks (wizard)](https://us.posthog.com/project/513547/insights/rizNn8ls)
- Insight: [Event card clicks (wizard)](https://us.posthog.com/project/513547/insights/WRDHoajZ)
- Insight: [Navigation clicks (wizard)](https://us.posthog.com/project/513547/insights/5LceUhK6)
- Insight: [Featured events to event clicks funnel (wizard)](https://us.posthog.com/project/513547/insights/5ktghGP5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
