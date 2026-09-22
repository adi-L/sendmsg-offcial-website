import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  // Used only when building with --prefix-paths (GitHub Pages preview)
  pathPrefix: `/sendmsg-offcial-website`,
  siteMetadata: {
    title: `שלח מסר - מערכת דיוור אלקטרוני`,
    description: `מערכת דיוור אלקטרוני לעסקים, נגישה וידידותית. ניוזלטרים, SMS, דפי נחיתה, קורסים דיגיטליים ו-CRM במקום אחד.`,
    siteUrl: `https://sendmsg.co.il`,
    phone: `077-4600600`,
    whatsapp: `972559377588`,
    panelUrl: `https://panel.sendmsg.co.il/`,
    social: {
      facebook: `https://www.facebook.com/sendmsg`,
      instagram: `https://www.instagram.com/sendmsg.system/`,
      tiktok: `https://www.tiktok.com/@sendmsg.system`,
      youtube: `https://www.youtube.com/c/SendmsgSystem?sub_confirmation=1`,
      linkedin: `https://www.linkedin.com/company/sendmsg/`,
      pinterest: `https://www.pinterest.com/sendmsg_system/`,
      spotify: `https://creators.spotify.com/pod/profile/sendmsg/`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `שלח מסר - SendMsg`,
        short_name: `SendMsg`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#0D598C`,
        display: `standalone`,
        // manual mode: files live in static/icons; favicon + apple-touch-icon
        // link tags are emitted by the SEO component
        legacy: false,
        icons: [
          {
            src: `/icons/icon-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
            purpose: `any`,
          },
          {
            src: `/icons/icon-384x384.png`,
            sizes: `384x384`,
            type: `image/png`,
            purpose: `any`,
          },
          {
            src: `/icons/icon-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
            purpose: `any`,
          },
          {
            src: `/icons/icon-192x192-maskable.png`,
            sizes: `192x192`,
            type: `image/png`,
            purpose: `maskable`,
          },
          {
            src: `/icons/icon-512x512-maskable.png`,
            sizes: `512x512`,
            type: `image/png`,
            purpose: `maskable`,
          },
        ],
      },
    },
    `gatsby-plugin-sitemap`,
  ],
}

export default config
