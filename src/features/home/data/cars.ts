export interface FleetCar {
  id: number;
  name: { ar: string; en: string };
  year: number;
  seats: number;
  pricePerDay: number;
  image: string;
}

// Placeholder fleet until the cars API is wired up.
export const fleetCars: FleetCar[] = [
  { id: 1, name: { ar: "مرسيدس E-Class", en: "Mercedes E-Class" }, year: 2022, seats: 4, pricePerDay: 500, image: "/images/car-item.jpg" },
  { id: 2, name: { ar: "هوندا أكورد", en: "Honda Accord" }, year: 2022, seats: 4, pricePerDay: 500, image: "/images/car-item.jpg" },
  { id: 3, name: { ar: "نيسان ألتيما", en: "Nissan Altima" }, year: 2022, seats: 4, pricePerDay: 500, image: "/images/car-item.jpg" },
  { id: 4, name: { ar: "تويوتا كورولا", en: "Toyota Corolla" }, year: 2022, seats: 4, pricePerDay: 500, image: "/images/car-item.jpg" },
  { id: 5, name: { ar: "تويوتا كامري", en: "Toyota Camry" }, year: 2022, seats: 4, pricePerDay: 500, image: "/images/car-item.jpg" },
  { id: 6, name: { ar: "هيونداي سوناتا", en: "Hyundai Sonata" }, year: 2023, seats: 4, pricePerDay: 450, image: "/images/car-item.jpg" },
];
