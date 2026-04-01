export interface WeddingConfig {
    coupleNames: string;
    weddingDate: string; // ISO Format: "2026-12-12T14:00:00"
    venue: {
        name: string;
        mapLink: string; // Google Maps URL
    };
    theme: {
        primaryColor: string; // HEX code for Tailwind integration
        secondaryColor: string;
        mode: 'light' | 'dark';
    };
    entrance: {
        type: 'envelope' | 'curtains';
    };
    features: {
        scratchToReveal: boolean;
        backgroundMusic: boolean;
        musicSrc?: string; // Path to audio file in public folder
        liveGuestbook: boolean;
        backgroundType: 'image' | 'canvas' | 'video';
        bgAsset?: string; // URL or path to background image
    };
    mpesa: {
        enabled: boolean;
        type: 'till' | 'paybill' | 'send_money';
        number: string; // The Till, Paybill, or Phone Number
        accountName?: string; // For Paybill account numbers or the registered Till name
        message: string; // A polite message about gifting
    };
    gallery: {
        images: string[];
        guestAlbumLink: string;
    };
    content: {
        story: string;
        schedule: { time: string; event: string; description?: string }[];
        bridalTeam: { name: string; role: string; photo?: string }[];
    };
}

// Data
export const siteConfig: WeddingConfig = {
    coupleNames: "Faith & Chris",
    weddingDate: "2026-07-12T14:00:00",
    venue: {
        name: "Atlanta, Georgia",
        mapLink: "https://maps.app.goo.gl/5Aye5qqZUjvEjAZE7",
    },
    theme: {
        primaryColor: "#780606",
        secondaryColor: "#F5F5F5",
        mode: "light",
    },
    entrance: {
        type: "curtains",
    },
    features: {
        scratchToReveal: true,
        backgroundMusic: true,
        musicSrc: "/audio/wedding-march.mp3",
        liveGuestbook: true,
        backgroundType: "image",
        bgAsset: "images/background.jpg",
    },
    mpesa: {
        enabled: true,
        type: "till", // till / paybill / send_money
        number: "123456",
        accountName: "Faith Weds Chris",
        message: "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a cash gift, you can use the details below.",
    },
    gallery: {
        images: [
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
        ],
        guestAlbumLink: "https://photos.google.com/share/your-album-link-here",
    },
    content: {
        story: "It all started with a simple hello...",
        schedule: [
            { time: "09:00 AM", event: "Arrival & Seating" },
            { time: "10:00 AM", event: "The Vows", description: "Main ceremony begins." },
            { time: "01:00 PM", event: "Reception", description: "Food, drinks, and dancing!" },
        ],
        bridalTeam: [
            { name: "Michael Scott", role: "Best Man" },
            { name: "Pam Beesly", role: "Maid of Honor" },
            { name: "Jim Halpert", role: "Groomsman" },
            { name: "Angela Martin", role: "Bridesmaid" },
            { name: "Dwight Schrute", role: "Groomsman" },
            { name: "Kelly Kapoor", role: "Bridesmaid" },
        ],
    },
};