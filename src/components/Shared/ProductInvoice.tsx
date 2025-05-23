"use client";
import { motion } from "framer-motion";
import { FiBox, FiDownload, FiUser } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { useGetPaymentWithVerifyQuery } from "@/components/Redux/features/payment/paymentApi";

// Theme base color variables (adjusted for a softer, more modern look)
const BASE_BG = "bg-[#181c2a]";
const BASE_CARD = "bg-[#23283a]";
const BASE_ACCENT = "bg-orange-500";
const BASE_ACCENT_HOVER = "bg-orange-600";
const BASE_ACCENT_TEXT = "text-orange-500";
const BASE_TEXT = "text-white";
const BASE_TEXT_SUBTLE = "text-white/70";
const BASE_BORDER = "border-white/10";
const BASE_GRADIENT = "bg-orange-500";

// Font size utility classes for easy adjustment
const FONT_HEADER = "text-2xl sm:text-3xl font-bold";
const FONT_SUBHEADER = "text-xl sm:text-2xl font-semibold";
const FONT_LABEL = "text-base sm:text-lg";
const FONT_BODY = "text-base sm:text-lg";
const FONT_SMALL = "text-sm sm:text-base";
const FONT_XSMALL = "text-xs sm:text-sm";
const FONT_TOTAL = "text-lg sm:text-xl font-bold";

const ProductInvoice = () => {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const { data } = useGetPaymentWithVerifyQuery(tranId);
  const order = data?.data;

  console.log(order);

  if (!order) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${BASE_BG}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-[#ff7a1a] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Calculate subtotal (sum of item price * quantity)
  const subtotal = order.items?.reduce(
    (sum: number, item: any) => sum + (item.price * (item.quantity)),
    0
  );
  
  const discount = order.discount || 0;
  const total = order.total || subtotal || 0;

  return (
    <div className={` pt-16 pb-16 px-2 sm:px-4 flex items-center justify-center`}>
      <div
        className={`w-full max-w-4xl mx-auto ${BASE_CARD} ${BASE_TEXT} rounded-lg shadow-xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`p-6 ${BASE_GRADIENT} ${BASE_TEXT}`}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div className="flex items-center gap-2">
              <FiBox className="text-3xl sm:text-4xl" />
              <h1 className={FONT_HEADER}>Chapai Mango Bazar</h1>
            </div>
            <div className="text-left md:text-right">
              <h2 className={FONT_SUBHEADER}>Invoice</h2>
              <p className={`text-white/80 mt-1 ${FONT_XSMALL} break-all`}>
                #{order?.transactionId?.slice(0, 20)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Order Info */}
        <div className={`p-6 flex flex-col md:flex-row justify-between border-b ${BASE_BORDER} gap-4`}>
          <div className="flex-1 min-w-0">
            <h3 className={`${FONT_LABEL} font-semibold mb-2 flex items-center gap-2`}>
              <FiUser className="text-lg sm:text-xl" /> Customer Info:
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap justify-between md:block">
                <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Name:</span>
                <span className={`font-medium block pl-1 md:inline ${FONT_BODY}`}>
                  {order?.user?.name || order?.name}
                </span>
              </div>
              <div className="flex flex-wrap justify-between md:block">
                <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Email:</span>
                <span className={`font-medium block pl-1 md:inline break-all ${FONT_BODY}`}>
                  {order?.user?.email || order?.email}
                </span>
              </div>
              <div className="flex flex-wrap justify-between md:block">
                <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Phone:</span>
                <span className={`font-medium block pl-1 md:inline ${FONT_BODY}`}>
                  {order?.phoneNumber || order?.user?.phoneNumber || "-"}
                </span>
              </div>
              <div className="flex flex-wrap justify-between md:block">
                <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Address:</span>
                <span className={`font-medium block pl-1 md:inline break-all ${FONT_BODY}`}>
                  {order?.address || "-"}
                </span>
              </div>
              <div className="flex flex-wrap justify-between md:block">
                <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>City:</span>
                <span className={`font-medium block pl-1 md:inline ${FONT_BODY}`}>
                  {order?.city || "-"}
                </span>
              </div>
            </div>
          </div>
          <div className=" min-w-0 space-y-2 text-right">
            <div className="flex flex-wrap justify-between md:block">
              <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Issue Date:</span>
              <span className={`font-medium block pl-1 md:inline ${FONT_BODY}`}>
                {order?.createdAt?.slice(0, 10)}
              </span>
            </div>
            <div className="flex flex-wrap justify-between md:block">
              <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Payment Status:</span>
              <span className={`font-medium block pl-1 md:inline ${FONT_BODY}`}>
                {order?.status}
              </span>
            </div>
            <div className="flex flex-wrap justify-between md:block">
              <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Payment Method:</span>
              <span className={`font-medium block pl-1 md:inline capitalize ${FONT_BODY}`}>
                {order?.paymentMethod?.replace(/_/g, " ") || "-"}
              </span>
            </div>
            {order?.couponId && (
              <div className="flex flex-wrap justify-between md:block">
                <span className={`${BASE_TEXT_SUBTLE} ${FONT_SMALL}`}>Coupon:</span>
                <span className={`font-medium block pl-1 md:inline break-all ${FONT_BODY}`}>
                  {order?.couponId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="p-6">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[340px]">
              <thead className="bg-white/5">
                <tr>
                  <th className={`text-left py-2 px-2 text-white font-medium ${FONT_SMALL}`}>
                    Product
                  </th>
                  <th className={`text-center py-2 px-2 text-white font-medium ${FONT_SMALL}`}>
                    Quantity
                  </th>
                  <th className={`text-right py-2 px-2 text-white font-medium ${FONT_SMALL}`}>
                    Price
                  </th>
                  <th className={`text-right py-2 px-2 text-white font-medium ${FONT_SMALL}`}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item: any, idx: number) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`border-b ${BASE_BORDER}`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-700 rounded-md flex items-center justify-center">
                            <FiBox className="text-gray-300 text-lg sm:text-xl" />
                          </div>
                        )}
                        <span className={`font-medium break-all ${FONT_SMALL}`}>
                          {item.product?.name}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 px-2 text-center font-medium ${FONT_BODY}`}>
                      {item.quantity}
                    </td>
                    <td className={`py-3 px-2 text-right font-medium ${FONT_BODY}`}>
                      <span className={BASE_ACCENT_TEXT}>৳{item.price}</span>
                    </td>
                    <td className={`py-3 px-2 text-right font-medium ${FONT_BODY}`}>
                      <span className={BASE_ACCENT_TEXT}>৳{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex justify-end"
          >
            <div className="w-full max-w-xs space-y-2 text-base sm:text-lg">
              <div className="flex justify-between">
                <span className={BASE_TEXT_SUBTLE}>Subtotal:</span>
                <span className="font-medium">৳{subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={BASE_TEXT_SUBTLE}>Discount:</span>
                <span className="font-medium">-৳{discount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className={BASE_TEXT_SUBTLE}>Tax:</span>
                <span className="font-medium">৳0</span>
              </div>
              <div className={`flex justify-between pt-3 border-t ${BASE_BORDER}`}>
                <span className={FONT_TOTAL}>Total:</span>
                <span className={`${FONT_TOTAL} ${BASE_ACCENT_TEXT}`}>
                  ৳{total?.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className={`p-6 bg-white/5 border-t ${BASE_BORDER}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm sm:text-base text-white/60">
            <div className="text-center md:text-left">
              <p>Thank you for shopping with Chapai Mango Bazar!</p>
              <p>For help, call: +880 1711-111111</p>
            </div>
            <button
              onClick={() => window.print()}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${BASE_ACCENT} text-white rounded-lg hover:${BASE_ACCENT_HOVER} transition text-sm sm:text-base`}
            >
              <FiDownload className="text-base sm:text-lg" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInvoice;