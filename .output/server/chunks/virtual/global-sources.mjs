const sources = [
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [
            {
                "loc": "/",
                "images": [
                    {
                        "loc": "/images/Vignette.avif",
                        "caption": "Full stack website",
                        "geoLocation": "Paris, France",
                        "title": "Create your website"
                    },
                    {
                        "loc": "/images/urban.avif",
                        "caption": "Shop project",
                        "geoLocation": "Paris, France",
                        "title": "Urbanstyle"
                    },
                    {
                        "loc": "/images/news.avif",
                        "caption": "news for your country",
                        "geoLocation": "Paris, France",
                        "title": "World news"
                    },
                    {
                        "loc": "/images/fitness.avif",
                        "caption": "Nutritional dashboard",
                        "geoLocation": "Paris, France",
                        "title": "NutriWeb"
                    }
                ]
            },
            {
                "loc": "/skills"
            },
            {
                "loc": "/animation"
            }
        ],
        "sourceType": "user"
    },
    {
        "context": {
            "name": "nuxt:pages",
            "description": "Generated from your static page files.",
            "tips": [
                "Can be disabled with `{ excludeAppSources: ['nuxt:pages'] }`."
            ]
        },
        "urls": [
            {
                "loc": "/animation"
            },
            {
                "loc": "/"
            },
            {
                "loc": "/news"
            },
            {
                "loc": "/skills"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
