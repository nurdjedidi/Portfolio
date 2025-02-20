const sources = [
    {
        "context": {
            "name": "sitemap:urls",
            "description": "Set with the `sitemap.urls` config."
        },
        "urls": [
            {
                "loc": "/"
            },
            {
                "loc": "/services",
                "images": [
                    {
                        "loc": "/images/nurdjedd.jpg",
                        "caption": "Full stack website",
                        "title": "I create your website"
                    },
                    {
                        "loc": "/images/seo.jpg",
                        "caption": "SEO optimization",
                        "title": "Optimize the SEO of your website"
                    }
                ]
            },
            {
                "loc": "/projects",
                "images": [
                    {
                        "loc": "/images/urban.avif",
                        "caption": "Shop project",
                        "title": "Urbanstyle"
                    },
                    {
                        "loc": "/images/news.avif",
                        "caption": "news for your country",
                        "title": "World news"
                    },
                    {
                        "loc": "/images/fitness.avif",
                        "caption": "Nutritional dashboard",
                        "title": "NutriWeb"
                    }
                ]
            },
            {
                "loc": "/about"
            },
            {
                "loc": "/contact"
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
                "loc": "/about"
            },
            {
                "loc": "/contact"
            },
            {
                "loc": "/"
            },
            {
                "loc": "/news"
            },
            {
                "loc": "/projects"
            },
            {
                "loc": "/services"
            }
        ],
        "sourceType": "app"
    }
];

export { sources };
//# sourceMappingURL=global-sources.mjs.map
