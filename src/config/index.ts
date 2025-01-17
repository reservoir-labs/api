export const config = (): object => ({
    port: parseInt(process.env.PORT || '3001', 10),
    coingecko_api_key: process.env.COINGECKO_API_KEY,
});
