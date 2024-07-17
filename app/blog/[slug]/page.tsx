import React from 'react'

const page = ({params}: {params: {slug: string, content:string}}) => {
  return (
    <div>
        The post: {params.slug}
    </div>
  )
}

export default page