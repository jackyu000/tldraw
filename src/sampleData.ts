// Sample JSON data array to visualize
export const sampleDataArray = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    active: true,
    thumbnail: "https://picsum.photos/id/237/200/200",
    address: {
      street: "123 Main St",
      city: "Anytown",
      country: "USA",
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    tags: ["developer", "designer", "photographer"],
    skills: {
      programming: ["JavaScript", "TypeScript", "Python"],
      design: ["UI/UX", "Figma", "Sketch"],
      other: ["Photography", "Writing"]
    }
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 28,
    active: true,
    thumbnail: "https://picsum.photos/id/64/200/200",
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      country: "Canada",
      coordinates: {
        lat: 43.6532,
        lng: -79.3832
      }
    },
    tags: ["artist", "musician", "teacher"],
    skills: {
      arts: ["Painting", "Drawing", "Sculpture"],
      music: ["Piano", "Guitar", "Vocals"],
      teaching: ["Math", "Science", "Art"]
    }
  },
  {
    id: 3,
    name: "Alex Johnson",
    age: 35,
    active: false,
    thumbnail: "https://picsum.photos/id/1025/200/200",
    address: {
      street: "789 Pine Blvd",
      city: "Elsewhere",
      country: "UK",
      coordinates: {
        lat: 51.5074,
        lng: -0.1278
      }
    },
    tags: ["engineer", "researcher", "writer"],
    skills: {
      engineering: ["Mechanical", "Civil", "Electrical"],
      research: ["Data Analysis", "Field Work", "Lab Testing"],
      writing: ["Technical", "Fiction", "Blogs"]
    },
    projects: [
      {
        name: "City Bridge",
        year: 2022,
        completed: true,
        image: "https://picsum.photos/id/1053/200/200"
      },
      {
        name: "Research Paper",
        year: 2023,
        completed: false
      }
    ]
  },
  {
    id: 4,
    name: "Taylor Wilson",
    age: 42,
    active: true,
    thumbnail: "https://picsum.photos/id/338/200/200",
    specialties: ["Data Science", "Machine Learning", "AI"],
    publications: [
      { title: "Modern AI Approaches", year: 2023, citations: 127 },
      { title: "Data Science in Practice", year: 2021, citations: 89 }
    ]
  }
];
