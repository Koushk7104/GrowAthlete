# GrowAthlete

Marketing and product-demo site for GrowAthlete, a verified digital sports identity platform for athletes in India.

## Pages

| Page | File | What it shows |
| --- | --- | --- |
| Home | `index.html` | Thesis, market numbers, platform overview |
| Product | `product.html` | Interactive athlete profile builder |
| Scout | `scout.html` | Searchable sample athletes, shortlist and compare |
| The gap | `problem.html` | Before/after proof demo and the five gaps |
| Ecosystem | `ecosystem.html` | Roles, network loop and career path |
| Join | `join.html` | Early-access waitlist form |

Shared code lives in `css/style.css` and `js/` (`main.js` for header, footer, transitions and animations; `data.js` for sample athletes).

## Run locally

No build step. Serve the folder with any static server, for example:

```
npx serve .
```

## Notes

- All athletes are invented sample data.
- The waitlist form stores nothing yet. Set `ENDPOINT` in `js/join.js` to your form service URL.
- `archive/` holds earlier single-page versions of the site.
