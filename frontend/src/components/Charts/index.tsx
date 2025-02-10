import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });


export function PieChart(){

    const options = {
            series: [44, 55, 13, 33],
            labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
        }

    let series: number[] = [0, 0, 0, 0, 0];
    const chartOptions = {
        labels: ['Apple', 'Mango', 'Orange', 'Watermelon']
    }

    return(
            <>
            <ApexChart type="pie" options={options} series={series} height={200} width={500} />
            </>
    )
    
}