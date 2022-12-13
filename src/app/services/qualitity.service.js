import httpService from "./http.service";

const qualityEndPoint = "quality/";

const QualityService = {
    get: async () => {
        const { data } = await httpService.get(qualityEndPoint);
        return data;
    }
};

export default QualityService;
