# Dependency review

Reviewed while implementing issue #1. The audit reports 16 moderate findings propagated from one minimatch denial-of-service advisory (GHSA-g3hv-75wg-m249) through the development-only ESLint dependency tree. These packages process lint file patterns, not application requests or user financial inputs. Do not lint untrusted glob patterns. No production dependency findings were reported.

`npm audit fix` is used for compatible updates. Do not apply `npm audit fix --force`: its suggested downgrades to ESLint 4 and Next.js lint config 12 are incompatible with this app. Likewise, forcing minimatch 11 over older consumers changes its API and is not a safe blanket override.

Recheck `npm audit` when updating lint dependencies and replace this note when supported upstream versions resolve the advisory. Audit is a review task rather than a failing CI gate for these acknowledged development-only findings. Functional CI checks remain mandatory.

Sources: https://github.com/advisories/GHSA-g3hv-75wg-m249 and the installed dependency graph reported by `npm audit --json`.
