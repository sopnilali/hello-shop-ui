'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import './blog.css'
import { useGetAllBlogsQuery } from '@/components/Redux/features/blog/blogApi';
import CategoryModal from '@/components/Modals/CategoryModal';
import { FiFilter } from 'react-icons/fi';

const BlogPages = () => {
    const { data: blogs, isLoading, isError } = useGetAllBlogsQuery(undefined)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900/70 backdrop-blur-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 dark:border-gray-200"></div>
            </div>
        )
    }

    if (isError || !blogs?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900/70 backdrop-blur-md">
                <h1 className="text-2xl text-red-500 dark:text-red-300">Error loading blogs</h1>
            </div>
        )
    }

    return (
        <div className="px-4 py-20 dark:bg-gray-900/40 bg-white backdrop-blur-2xl">
            <div className="container mx-auto ">
                <div className="flex justify-between items-center mb-12 pt-10">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-gray-900 dark:text-white" 
                    >
                        Blogs
                    </motion.h2>
                </div>
            </div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 container mx-auto"
            >
                {blogs?.data && blogs?.data.length > 0 ? blogs?.data.map((blog: any) => (
                    <motion.div
                        key={blog.id}
                        variants={itemVariants}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/70 shadow hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-stretch gap-6"
                    >
                        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                            <Link href={`/blog/${blog.id}`} className="block h-full">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="relative w-full h-56 md:h-full rounded-lg overflow-hidden"
                                >
                                    <Image
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority={true}
                                    />
                                </motion.div>
                            </Link>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div className='flex flex-col gap-2'>
                                <Link href={`/blog/${blog.id}`}>
                                    <motion.h2
                                        className="text-2xl font-bold mb-2 leading-snug text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                                    >
                                        {blog.title}
                                    </motion.h2>
                                </Link>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3 space-x-2">
                                    <span className="font-semibold uppercase tracking-wide">{blog.author.name || "Anonymous"}</span>
                                    <span>•</span>
                                    <span>
                                        {blog.createdAt
                                            ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })
                                            : ''}
                                    </span>
                                </div>
                                <div className="text-gray-700 dark:text-gray-300 text-base mb-4 line-clamp-3">
                                    <div
                                        className="text-gray-800 dark:text-gray-200"
                                        dangerouslySetInnerHTML={{
                                            __html: blog.content.length > 60 ? blog.content.substring(0, 200) + '...' : blog.content
                                        }}
                                    />
                                </div>
                            </div>
                            <Link href={`/blog/${blog.id}`}>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-2 px-5 py-2 border border-gray-800 dark:border-gray-200 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-700 dark:hover:bg-gray-600 text-sm font-semibold hover:text-white dark:hover:text-white duration-300 transition-all cursor-pointer"
                                >
                                    Read More
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                )) : (
                    <div className=" flex items-center justify-center bg-white dark:bg-gray-900/70 backdrop-blur-md">
                        <h1 className="text-2xl text-orange-500">No blogs found</h1>
                    </div>
                )}
            </motion.div>


        </div>
    )
}

export default BlogPages
