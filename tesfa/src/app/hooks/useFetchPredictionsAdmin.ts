import { useEffect, useState } from "react"
import { Prediction } from "../utils/type";
import { fetchPredictionsAdmin } from "../utils/fetchPredictionsAdmin";

export const useFetchPredictions = () =>{
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null);

    useEffect(() =>{
        const getPredictions = async () => {
            try{
                setLoading(true)
                const predictionsData = await fetchPredictionsAdmin()
                setPredictions(predictionsData)
            } catch (error) {
                setError(error as Error)
            }finally{
                setLoading(false)
            }
        };
        getPredictions();
    }, []);
    return {predictions,loading,error}
}