import React, { useState, useMemo } from 'react'
import { useGetAllOrderQuery } from '@/components/Redux/features/order/orderApi'
import { useGetAllReviewQuery } from '@/components/Redux/features/review/reviewApi'
import { useAllDiscountsQuery } from '@/components/Redux/features/discount/discountApi'
import { useGetAllUserQuery } from '@/components/Redux/features/user/useApi'
import { useAllUsersStatsQuery, useAllOrdersStatsQuery, useAllProductsStatsQuery } from '@/components/Redux/features/stats/statsApi'
import { FaShoppingCart, FaStar, FaTag, FaUsers, FaBox, FaMoneyBillWave, FaChartLine, FaCreditCard, FaPercent, FaStore } from 'react-icons/fa'
import { Line, Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useAllShopQuery } from '@/components/Redux/features/shop/shopApi'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const DashboardStats = () => {
  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly')
  const { data: orders } = useGetAllOrderQuery([
    { name: 'limit', value: 5 },
    { name: 'page', value: 1 }
  ])
  const { data: reviews } = useGetAllReviewQuery(undefined)
  const { data: discounts } = useAllDiscountsQuery(undefined)
  const { data: users } = useGetAllUserQuery(undefined)
  const { data: userStats } = useAllUsersStatsQuery(undefined)
  const { data: orderStats } = useAllOrdersStatsQuery(undefined)
  const { data: productStats } = useAllProductsStatsQuery(undefined)
  const { data: shops } = useAllShopQuery(undefined)

  console.log(userStats)

  // Process review data for average rating
  const reviewStats = useMemo(() => {
    if (!reviews?.data) return { averageRating: 0, totalReviews: 0 }

    const totalReviews = reviews.data.length
    const totalRating = reviews.data.reduce((sum: number, review: any) => sum + review.rating, 0)
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0

    return {
      averageRating,
      totalReviews
    }
  }, [reviews])

  // Process discount data for chart
  const discountData = useMemo(() => {
    if (!discounts?.data?.data) return null

    const activeDiscounts = discounts.data.data.filter((discount: any) => discount.status === 'ACTIVE')
    const expiredDiscounts = discounts.data.data.filter((discount: any) => discount.status === 'EXPIRED')

    return {
      labels: ['Active', 'Expired'],
      datasets: [{
        data: [activeDiscounts.length, expiredDiscounts.length],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',  // Active
          'rgba(255, 99, 132, 0.6)',  // Expired
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      }]
    }
  }, [discounts])

  // Process order status data for pie chart
  const orderStatusData = useMemo(() => {
    if (!orderStats?.ordersByStatus) return null

    return {
      labels: orderStats.ordersByStatus.map((status: any) => status.status),
      datasets: [{
        data: orderStats.ordersByStatus.map((status: any) => status._count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',  // PENDING
          'rgba(255, 206, 86, 0.6)',  // PROCESSING
          'rgba(54, 162, 235, 0.6)',  // DELIVERED
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      }]
    }
  }, [orderStats])

  // Process payment method data for bar chart
  const paymentMethodData = useMemo(() => {
    if (!orderStats?.ordersByPaymentMethod) return null

    return {
      labels: orderStats.ordersByPaymentMethod.map((method: any) => method.paymentMethod),
      datasets: [{
        label: 'Orders by Payment Method',
        data: orderStats.ordersByPaymentMethod.map((method: any) => method._count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      }]
    }
  }, [orderStats])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Payment Methods Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
      },
    },
  }

  const discountOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Discount Status Distribution',
      },
    },
  }

  return (
    <div className="space-y-6 p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold mt-1">{orderStats?.totalOrders || 0}</h3>
            </div>
            <div className="p-3 bg-gray-400/10 rounded-lg">
              <FaShoppingCart className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">TK {orderStats?.totalRevenue || 0}</h3>
            </div>
            <div className="p-3 bg-gray-400/10 rounded-lg">
              <FaMoneyBillWave className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">{productStats?.totalProducts || 0}</h3>
            </div>
            <div className="p-3 bg-gray-400/10 rounded-lg">
              <FaBox className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Shops</p>
              <h3 className="text-2xl font-bold mt-1">{shops?.meta?.total || 0}</h3>
            </div>
            <div className="p-3 bg-gray-400/10 rounded-lg">
              <FaStore className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{users?.meta?.total || 0}</h3>
            </div>
            <div className="p-3 bg-gray-400/10 rounded-lg">
              <FaUsers className="text-gray-400 text-xl" />
            </div>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Payment Methods Chart - 70% */}
        <div className="lg:col-span-8 bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="h-[400px]">
            {paymentMethodData ? (
              <Bar options={chartOptions} data={paymentMethodData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading chart data...
              </div>
            )}
          </div>
        </div>

        {/* Order Status Pie Chart - 30% */}
        <div className="lg:col-span-4 bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="h-[400px]">
            {orderStatusData ? (
              <Pie options={pieOptions} data={orderStatusData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading chart data...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Order ID</th>
                <th className="px-4 py-3 text-left text-sm">Customer</th>
                <th className="px-4 py-3 text-left text-sm">Amount</th>
                <th className="px-4 py-3 text-left text-sm">Payment Method</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {orderStats?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm">{order.id}</td>
                  <td className="px-4 py-3 text-sm">{order.name}</td>
                  <td className="px-4 py-3 text-sm">TK {order.total}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-700">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      order.status === 'DELIVERED' ? 'border-green-500/20 text-green-400' :
                      order.status === 'PENDING' ? 'border-yellow-500/20 text-yellow-400' :
                      'border-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
