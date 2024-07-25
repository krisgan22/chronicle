import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn: () => any) => {
    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const orgResponse = await fn();
        console.log("useAppwrite.ts: useAppwrite(): ", orgResponse);
        setData(orgResponse);
      } catch (error) {
        console.error("useAppwrite(): ", error)
        Alert.alert('Error', "There was an issue, try again");
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, isLoading, refetch };
}

export default useAppwrite;