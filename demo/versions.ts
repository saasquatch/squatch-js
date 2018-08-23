export async function getVersions(): Promise<string[]> {
  const headers = {
    Origin: "google.com",
    "X-Requested-With":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
  };

  const response = await fetch(
    "https://cors-anywhere.herokuapp.com/https://registry.npmjs.org/@saasquatch/squatch-js",
    {}
  );
  const body = await response.json();
  return Object.keys(body.versions).reverse();
}
