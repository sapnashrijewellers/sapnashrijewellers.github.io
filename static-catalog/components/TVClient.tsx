// "use client";

// import type { CatalogData, Rates } from "@/types/catalog";

// interface Props {
//   data: CatalogData;
//   driveURL: string;
//   rateURL: string;
//   initialRates: Rates;
// }

// export default function TVClient({ data, driveURL, rateURL, initialRates }: Props) {
//   let rates = initialRates;
//   const subCategories = data.sub_categories ?? [];
//   let currentIndex = 0;
//   let fade = true;
//   let product = data.categorizedProducts[subCategories[currentIndex]][0];

//   async function fetchRates() {
//     try {
//       const res = await fetch(rateURL);
//       if (!res.ok) throw new Error("Rate fetch failed");
//       rates = await res.json();
//     } catch (err) {
//       console.error("Failed to fetch rates:", err);
//     }
//   }

//   async function* productCycler() {
//     while (true) {
//       yield product;
//       await new Promise((r) => setTimeout(r, 10000)); // 10s per product
//       await fetchRates();
//       currentIndex = (currentIndex + 1) % subCategories.length;
//       product = data.categorizedProducts[subCategories[currentIndex]][0];
//     }
//   }

//   // Start loop immediately after first render
//   (async () => {
//     const container = document.getElementById("tv-container");
//     for await (const prod of productCycler()) {
//       fade = false;
//       if (container) container.classList.add("opacity-0");
//       await new Promise((r) => setTimeout(r, 1000));
//       if (container) {
//         container.classList.remove("opacity-0");
//         container.innerHTML = renderProductHTML(prod);
//       }
//       fade = true;
//     }
//   })();

//   function renderProductHTML(p: any) {
//     return `
//       <div class="transition-opacity duration-1000 flex flex-col md:grid md:grid-cols-2 gap-2 w-full h-full p-2 overflow-hidden">
//         <div class="w-full h-full flex justify-start items-start">
//           <img src="${driveURL}${p.images[0]}" alt="${p.name}" class="w-full h-auto object-contain rounded-2xl" />
//         </div>
//         <div class="flex flex-col gap-3 p-2 text-2xl leading-tight overflow-hidden">
//           <div>
//             <h1 class="font-extrabold mb-2">${p.name}</h1>
//             <p><b>शुद्धता:</b> ${p.purity}</p>
//             <p><b>वज़न:</b> ${p.weight} g</p>
//           </div>
//         </div>
//       </div>
//     `;
//   }

//   // Initial render
//   return (
//     <div
//       id="tv-container"
//       className="transition-opacity duration-1000 flex flex-col md:grid md:grid-cols-2 gap-2 w-full h-full p-2 overflow-hidden"
//       dangerouslySetInnerHTML={{ __html: renderProductHTML(product) }}
//     />
//   );
// }
