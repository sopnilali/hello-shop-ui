"use client";

import { selectCurrentToken } from "@/components/Redux/features/auth/authSlice";
import { useGetUserQuery, useUpdateUserMutation } from "@/components/Redux/features/user/useApi";
import { useAppSelector } from "@/components/Redux/hooks";
import { verifyToken } from "@/components/Utils/verifyToken";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import React from "react";
import { toast } from "sonner";
import LoadingPage from "./profileSkeleton";
import { ShoppingBagIcon } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  avatar: string;
  bio: string;
  contactNumber?: string;
  stats: {
    watched: number;
    watching: number;
    lists: number;
  };
}

interface FormData {
  name: string;
  email: string;
  contactNumber: string;
}

const UserProfile = () => {
  const token = useAppSelector(selectCurrentToken);
  let userInfo;
  if (token) {
    userInfo = verifyToken(token);
  }

  const userId = userInfo?.id;

  const { data, isLoading } = useGetUserQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "watchlist">(
    "profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    contactNumber: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [user, setUser] = useState<UserData>({
    name: "John Doe",
    email: "john@movielovers.com",
    joinDate: "January 2023",
    avatar:
      "https://streamvid.jwsuperthemes.com/wp-content/uploads/2023/06/Brooke-Mulford2-305x305.jpg",
    bio: "Film connoisseur & cinema enthusiast",
    stats: {
      watched: 427,
      watching: 12,
      lists: 8,
    },
  });

  // Update formData when user data is loaded
  React.useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        email: data.data.email || "",
        contactNumber: data.data.contactNumber || "",
      });
      setPreviewImage(data.data.profilePhoto || "");
    }
  }, [data]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage("");
    setThumbnail(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating Profile...");

    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(userData));

      if (thumbnail) {
        formDataToSend.append("file", thumbnail);
      }

      const response = await updateUser({
        id: userId,
        data: formDataToSend,
      }).unwrap();

      if (response?.data) {
        setFormData((prev) => ({
          ...prev,
          name: response.data.name || prev.name,
          email: response.data.email || prev.email,
          contactNumber: response.data.contactNumber || prev.contactNumber,
        }));

        if (response.data.profilePhoto) {
          setPreviewImage(response.data.profilePhoto);
        }

        setIsEditing(false);
        toast.success("Profile updated successfully!", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile", { id: toastId });
    }
  };

  if(isLoading){
    return (
      <LoadingPage/>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-28 from-primary to-secondary py-12 px-2 lg:px-8">
      <div className="container mx-auto">
        {/* Profile Header */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-primary/80 backdrop-blur-xl rounded-3xl p-2 md:p-8 shadow-2xl border border-white/10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full animate-spin-slow blur-2xl opacity-30"></div>
                <Image
                  width={150}
                  height={150}
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIj48ZGVmcz48Y2lyY2xlIGN4PSI1MCIgY3k9Ijc1IiByPSI1MCIgZmlsbD0iI2ZmZmZmZiIvPjwvZGVmcz48Zz48Y2lyY2xlIGN4PSI1MCIgY3k9Ijc1IiByPSI1MCIgZmlsbD0iIzAwMDAwMCIvPjwvZz48L3N2Zz4K"
                  src={previewImage || user?.avatar}
                  alt={formData.name || user?.name}
                  className="w-36 h-36 rounded-full mt-5 md:mt-2 border-4 border-white/10 shadow-xl object-cover"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary p-2 rounded-full hover:bg-primary-dark transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                    {previewImage && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl uppercase py-1 font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {data?.data?.name ? data?.data?.name : user?.name}
                </h1>
                <p className="mt-2 text-black flex items-center justify-center md:justify-start gap-2">
                  <svg
                    className="w-5 h-5 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Member since{" "}
                  {data?.data?.createdAt
                    ? data?.data?.createdAt.slice(0, 10)
                    : user?.joinDate}
                </p>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-2 gap-4 max-w-sm">
                  <div className="bg-white/5 p-4  rounded-xl border border-white/10">
                    <div className="text-lg md:text-2xl text-center font-bold text-primary">
                    0
                    </div>
                    <div className="text-sm text-center text-black">
                      Bought
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 text-center rounded-xl border border-white/10">
                    <div className="text-lg md:text-2xl font-bold text-secondary">
                    0
                    </div>
                    <div className="text-sm text-black">Rented</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-2 mb-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 rounded-t-xl text-sm md:text-base font-medium cursor-pointer flex items-center gap-2 transition-all ${
                  activeTab === "profile"
                    ? "text-black bg-white/10 border-b-2 border-primary"
                    : "text-black hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </button>
              <button
                onClick={() => setActiveTab("watchlist")}
                className={`px-6 text-sm md:text-base py-3 rounded-t-xl cursor-pointer font-medium flex items-center gap-2 transition-all ${
                  activeTab === "watchlist"
                    ? "text-black bg-white/10 border-b-2 border-primary"
                    : "text-black hover:bg-white/5"
                }`}
              >
                <ShoppingBagIcon className="w-5 h-5" />
                Purchase History
              </button>
            </div>

            {/* Content */}
            {activeTab === "profile" ? (
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-black">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 text-black bg-white/10 border border-white/10 rounded-xl focus:border-primary outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-black">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 text-black bg-white/10 border border-white/10 rounded-xl focus:ring-secondary focus:border-primary outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-black">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 text-black bg-white/10 border border-white/10 rounded-xl focus:border-primary outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-8">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 text-black bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-white cursor-pointer bg-gradient-to-r from-primary to-secondary rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 text-white bg-gradient-to-r cursor-pointer from-primary to-secondary rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto mt-10">
                <table className="min-w-full table-auto border-collapse border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-6 py-4 text-black font-medium whitespace-nowrap">
                        Thumbnail
                      </th>
                      <th className="text-left px-6 py-4 text-black font-medium whitespace-nowrap">
                        Name
                      </th>
                      <th className="text-left px-6 py-4 text-black font-medium whitespace-nowrap">
                        Price
                      </th>
                      <th className="text-left px-6 py-4 text-black font-medium whitespace-nowrap">
                        Date
                      </th>
                      <th className="text-left px-6 py-4 text-black font-medium whitespace-nowrap">
                        Type
                      </th>
                      <th className="text-left px-6 py-4 text-black font-medium whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 bg-primary/20 text-black">
                      <tr  className="">
                        <td className="px-6 py-4 w-[100px]">
                          <Image
                            src=""
                            alt=""
                            width={100}
                            height={150}
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIj48ZGVmcz48Y2lyY2xlIGN4PSI1MCIgY3k9Ijc1IiByPSI1MCIgZmlsbD0iI2ZmZmZmZiIvPjwvZGVmcz48Zz48Y2lyY2xlIGN4PSI1MCIgY3k9Ijc1IiByPSI1MCIgZmlsbD0iIzAwMDAwMCIvPjwvZz48L3N2Zz4K"
                            className="w-16 h-24 object-cover rounded-md border border-white/10"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold whitespace-nowrap">
                          <Link
                            href={`/`}
                            className="hover:text-primary transition-colors"
                          >
                           title
                          </Link>
                        </td>

                        <td className="px-6 py-4">200</td>
                        <td className="px-6 py-4">
                          200
                        </td>
                        <td className="px-6 py-4">purchaseStatus</td>
                        <td className="px-6 py-4 capitalize">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium bg-green-600/20 text-green-400 }`}
                          >
                            Pending
                          </span>
                        </td>
                      </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
