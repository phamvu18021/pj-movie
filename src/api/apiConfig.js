
const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: 'd3ddb2ade309677f3c32c5ae31d84c43',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;