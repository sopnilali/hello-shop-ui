"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useGetBlogQuery } from '@/components/Redux/features/blog/blogApi'
import { useParams } from 'next/navigation'
import { FaEye, FaUser, FaCalendarAlt, FaTag } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'

const BlogDetails = () => {
    const { id } = useParams()
    const { data: blog, isLoading, isError } = useGetBlogQuery(id)

    useEffect(() => {
        const incrementViewCount = () => {
            const currentViews = parseInt(localStorage.getItem(`blog_${id}_views`) || '0')
            localStorage.setItem(`blog_${id}_views`, (currentViews + 1).toString())
        }
        incrementViewCount()
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (isError || !blog?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <h1 className="text-2xl text-red-500">Error loading blog details</h1>
            </div>
        );
    }

    const localViews = parseInt(localStorage.getItem(`blog_${id}_views`) || '0')
    const totalViews = (blog.data.readingCount || 0) + localViews

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

    return (
        <motion.div 
            className="px-4 py-20 bg-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto ">
                {/* Blog Header */}
                <motion.div 
                    className="mb-8"
                    variants={itemVariants}
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {blog.data.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <FaUser className="text-gray-500" />
                            <span>{blog.data.author?.name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-500" />
                            <span>
                                {blog.data.createdAt ? new Date(blog.data.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : ''}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEye className="text-gray-500" />
                            <span>{totalViews} views</span>
                        </div>
                        {blog.data.categories && blog.data.categories.length > 0 && (
                            <div className="flex items-center gap-2">
                                <FaTag className="text-gray-500" />
                                <div className="flex gap-2">
                                    {blog.data.categories.map((category: any) => (
                                        <Link 
                                            key={category.id}
                                            href={`/blog?category=${category.id}`}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Featured Image */}
                {blog.data.thumbnail && (
                    <motion.div 
                        className="relative w-full h-[400px] mb-12 rounded-xl overflow-hidden shadow-lg"
                        variants={itemVariants}
                    >
                        <Image
                            src={blog.data.thumbnail}
                            alt={blog.data.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                )}

                {/* Blog Content */}
                <motion.div 
                    className="prose prose-lg max-w-none"
                    variants={itemVariants}
                >
                    <div 
                        className="blog-content container mx-auto"
                        dangerouslySetInnerHTML={{ __html: blog.data.content }} 
                    />
                </motion.div>

                {/* Author Bio */}
                {blog.data.author && (
                    <motion.div 
                        className="mt-12 p-6 bg-gray-50 rounded-xl"
                        variants={itemVariants}
                    >
                        <div className="flex items-center gap-4">
                            {blog.data.author.avatar && (
                                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                    <Image
                                        src={blog.data.author.avatar}
                                        alt={blog.data.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{blog.data.author.name}</h3>
                                {blog.data.author.bio && (
                                    <p className="text-gray-600 mt-1">{blog.data.author.bio}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

export default BlogDetails
