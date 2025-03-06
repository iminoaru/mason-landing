import nextra from 'nextra'
 

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withNextra = nextra({
    contentDirBasePath: '/documentation'
  })
   
export default withNextra(nextConfig)
