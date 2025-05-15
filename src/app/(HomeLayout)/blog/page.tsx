import React from 'react'

const page = () => {
  return (
    <div>
      <div className="container mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and insights about electronics and technology.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Card 1 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">March 15, 2024</span>
                <span className="text-sm text-[#ff4500]">Technology</span>
              </div>
              <h2 className="text-xl font-bold mb-3">The Future of Smart Home Technology</h2>
              <p className="text-gray-600 mb-4">Discover how smart home devices are revolutionizing our daily lives and what to expect in the coming years.</p>
              <button className="text-[#ff4500] font-semibold hover:text-[#e63e00] transition-colors">
                Read More →
              </button>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">March 12, 2024</span>
                <span className="text-sm text-[#ff4500]">Gadgets</span>
              </div>
              <h2 className="text-xl font-bold mb-3">Top 10 Must-Have Electronics in 2024</h2>
              <p className="text-gray-600 mb-4">Explore our curated list of the most essential electronic devices that you should consider this year.</p>
              <button className="text-[#ff4500] font-semibold hover:text-[#e63e00] transition-colors">
                Read More →
              </button>
            </div>
          </div>

          {/* Blog Card 3 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">March 10, 2024</span>
                <span className="text-sm text-[#ff4500]">Tips</span>
              </div>
              <h2 className="text-xl font-bold mb-3">How to Choose the Right Electronics</h2>
              <p className="text-gray-600 mb-4">Learn the essential factors to consider when purchasing new electronic devices for your needs.</p>
              <button className="text-[#ff4500] font-semibold hover:text-[#e63e00] transition-colors">
                Read More →
              </button>
            </div>
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-[#ff4500] hover:bg-[#e63e00] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  )
}

export default page
