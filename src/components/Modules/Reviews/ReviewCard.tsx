"use client";

import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/components/Redux/hooks";
import { selectCurrentToken } from "@/components/Redux/features/auth/authSlice";
import { verifyToken } from "@/components/Utils/verifyToken";
import DeletePendingReviewModal from "@/components/Modals/DeletePendingReviewModal";
import { useDeleteReviewMutation, useUpdateReviewMutation } from "@/components/Redux/features/review/reviewApi";
import { MdThumbUp } from "react-icons/md";
import { ThumbsUpIcon } from "lucide-react";

// Separate component for individual review items
const ReviewItem = ({ item, UserData }: { item: any; UserData: any }) => {



//   const [liked, setLiked] = useState(false);
//   const [addLikeOrDislike] = useAddLikeOrDislikeMutation();
//   const { data: likeOrDislikeCounts, isLoading } =
//     useGetLikesOrDislikesCountQuery({
//       reviewId: item.id,
//     });



  const date = new Date(item.createdAt);

//   const likes = likeOrDislikeCounts?.data?.likeCount;
//   const dislikes = likeOrDislikeCounts?.data?.dislikeCount;
//   const IsLikesOrDislikeStatus =
//     likeOrDislikeCounts?.data?.currentUserLikeStatus;

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


//   const handleAddLikeOrDislike = async (passedStatus: string) => {
//     let status;

//     if (passedStatus === "LIKED") {
//       status = "LIKED";
//     } else if (passedStatus === "DISLIKED") {
//       status = "DISLIKED";
//     }

//     const addLikeOrDislikeData = {
//       userId: UserData.id,
//       reviewId: item.id,
//       status,
//     };

//     try {
//       const res = await addLikeOrDislike(addLikeOrDislikeData);
//       // console.log(res);
//       if ("error" in res && res.error) {
//         const errorMessage =
//           (res.error as any)?.data?.message || "An error occurred";
//         //console.log(errorMessage);
//       } else {
//         //console.log(res?.data?.message);
//       }
//     } catch (error: any) {
//       //console.log(error.data.message);
//     }
//   };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0">
          <Image
            src={item?.user?.profilePhoto}
            alt="Reviewer Avatar"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col items-start gap-1 w-full">
            <Rating
              value={item.rating}
              readOnly
              style={{ maxWidth: 80, width: "100%" }}
              className="w-[100px] sm:w-[120px]"
            />
            <span className="font-bold text-gray-800">{item.user?.name || "Anonymous"}</span>
            <span className="text-sm text-gray-800">{formattedDate}</span>
          </div>
          <p className="mt-2 text-black text-sm">{item.reviewText}</p>
          {UserData ? (<div className="flex gap-x-5 translate-y-5 py-2 -mt-2">
            <button
              // onClick={() => handleAddLikeOrDislike("LIKED")}
              // onClick={() => setLiked(!liked)}
              className=" top-2 left-2  cursor-pointer flex gap-2 items-center   transition"
            >
              { true ? (
                <MdThumbUp className="h-6 w-6" />
              ) : (
                <ThumbsUpIcon
                  className="h-6 w-6"
                // className={`h-7 w-7 ${
                //   liked ? "text-blue-500" : "text-gray-500"
                // } hover:scale-110 rotate-180`}
                />
              )}

              {false ? <span>Pending..</span> : <span>likes</span>}
            </button>
            <button
              // onClick={() => handleAddLikeOrDislike("DISLIKED")}
              // onClick={() => setLiked(!liked)}
              className=" top-2 cursor-pointer left-2 flex gap-2  items-center transition"
            >
              {true ? (
                <MdThumbUp className="h-6 w-6 rotate-180" />
              ) : (
                <ThumbsUpIcon
                  className="h-6 w-6 rotate-180 translate-y-1"
                // className={`h-7 w-7 ${
                //   liked ? "text-blue-500" : "text-gray-500"
                // } hover:scale-110 rotate-180`}
                />
              )}

              <span>dislikes</span>
            </button>
          </div>) : <></>}
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({
  ReviewData,
  UserData,
  onReviewUpdate,
}: {
  ReviewData: any;
  UserData: any;
  onReviewUpdate?: () => void;
}) => {
  const token = useAppSelector(selectCurrentToken);
  let userinfo: any;
  if (token) {
    userinfo = verifyToken(token);
  }


  // console.log(userinfo);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const publishedReviews = ReviewData?.filter(
    (item: any) => item.status === "PUBLISHED"
  );
  const pendingReviews = ReviewData?.filter(
    (item: any) => item.status === "PENDING" && item?.userId === userinfo?.id
  );

  const handleEdit = (item: any) => {
    setEditingReviewId(item.id);
    setEditedText(item.reviewText);
  };

  const handleCancel = () => {
    setEditingReviewId(null);
    setEditedText("");
  };

  const handleSave = async (id: string) => {
    const toastId = toast.loading("Updating Review....", { duration: 2000 });

    const updateReviewData = {
      id,
      reviewText: editedText,
    };

    try {
      await updateReview(updateReviewData).unwrap();
      toast.success("Review updated successfully!", { id: toastId });
      setEditingReviewId(null);
      onReviewUpdate?.(); // Call the callback to refetch data
    } catch (error: any) {
      toast.error(error.message || "Failed to update review", { id: toastId });
      setEditingReviewId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting review...", { duration: 2000 });
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully!", { id: toastId });
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
      onReviewUpdate?.(); // Call the callback to refetch data
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete review", { id: toastId });
    }
  };

  const isUser = userinfo && pendingReviews?.length > 0;
  return (
    <div>
      {isUser && (
        <h1 className="text-lg font-semibold text-orange-600">
          Your Pending Reviews: {pendingReviews?.length}{" "}
        </h1>
      )}
      {isUser && (
        <div className=" rounded-lg mb-5  flex flex-col gap-6">
          {pendingReviews?.map((item: any) => (
            <div key={item.id} className="relative p-4 rounded-md">
              {/* Pending Tag */}

              {/* Review Content */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={item?.user?.profilePhoto}
                    alt="Reviewer Avatar"
                    width={60}
                    height={60}
                    className="rounded-full border border-gray-700 p-1"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <Rating
                      value={item.rating}
                      readOnly
                      style={{ maxWidth: 80, width: "100%" }}
                      className="w-[100px] sm:w-[120px]"
                    />
                    <span className="font-bold text-black ">{item.user?.name || "Anonymous"}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="border border-gray-800 p-3 rounded-xl mt-2 max-w-[300px] md:max-w-[400px] whitespace-pre-wrap break-all relative">
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {editingReviewId === item.id ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
                            className="text-sm text-green-400 hover:text-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-sm text-yellow-400 hover:text-yellow-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-sm text-blue-400 hover:text-blue-600 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setReviewToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-sm text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>

                    {/* Review Content or Editable Field */}
                    <p className="font-semibold text-black mt-1">
                      {item.user?.name || "Anonymous"}
                    </p>
                    {editingReviewId === item.id ? (
                      <textarea
                        className="mt-2 text-sm w-full border border-gray-500 outline-none focus:border-blue-600 p-2 rounded  text-black"
                        rows={3}
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                    ) : (
                      <p className="mt-2 text-gray-800 text-sm">
                        {item.reviewText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!publishedReviews?.length && <p>No reviews found</p>}
      {publishedReviews?.length > 0 && (
        <div className="rounded-lg flex flex-col gap-6">
          {publishedReviews?.map((item: any, index: number) => (
            <ReviewItem
              key={item.id || index}
              item={item}
              UserData={UserData}
            />
          ))}
        </div>
      )}

      <DeletePendingReviewModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        reviewToDelete={reviewToDelete}
        setReviewToDelete={setReviewToDelete}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ReviewCard;