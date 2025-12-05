declare module "*.json" {
  const value: Array<{
    url: string;
    image: string;
    price: number;
  }>;
  export default value;
}