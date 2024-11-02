export const formatNumber = (num) => {
    try{
        if(num>=1000) return Math.abs((num/1000).toFixed(1))+"K";
        else if(num>=1000000) return Math.abs((num/1000000).toFixed(1))+"M";
        else return Math.abs(num.toString());
    }catch{
        return num;
    }
};