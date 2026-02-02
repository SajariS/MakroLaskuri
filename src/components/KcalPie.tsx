import { Pie, PieChart } from "recharts"


type KcalPieProps = {
    sum: number
    limit: number
}

const PIE_COLORS: Record<string, string> = {
    used: "#4caf50",
    remaining: "#e0e0e0",
    limit: "#90caf9",
    over: "#f44336",
}

const buildKcalPieData = (sum: number, limit: number) => {
    if (sum <= limit) {
        return [
            { name: "TODO! i18n used", value: sum, fill:  PIE_COLORS.used},
            { name: "TODO! i18n remaining", value: limit - sum, fill: PIE_COLORS.remaining }
        ]
    }
    else {
        return [
            { name: "TODO! i18n limit", value: limit, fill: PIE_COLORS.limit  },
            { name: "TODO! i18n over", value: sum - limit, fill: PIE_COLORS.over }
        ]
    }
}

const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value
}: any) => {
    const radian = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * radian)
    const y = cy + radius * Math.sin(-midAngle * radian)

    return (
        <text
            x={x}
            y={y}
            fill="#000"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
        >
            {value}
        </text>
    )
}


export default function KcalPie({ sum, limit}: KcalPieProps) {
    const pieData = buildKcalPieData(sum, limit)

    return(
        <PieChart>
            <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
                stroke="none"
                label={renderLabel}
            />
        </PieChart>
    )
}