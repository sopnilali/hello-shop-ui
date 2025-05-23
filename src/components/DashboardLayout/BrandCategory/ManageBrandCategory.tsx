import React from 'react'
import ManageBrand from '../Brands/ManageBrand'
import ManageCategory from '../Category/ManageCategory'

const ManageBrandCategory = () => {


    return (
        <div className='flex flex-col lg:flex-row gap-4'>
            <div className='w-full lg:w-[70%]'>
                <ManageBrand />
            </div>
            <div className='w-full lg:w-[30%]'>
                <ManageCategory />
            </div>
        </div>
    )
}

export default ManageBrandCategory
