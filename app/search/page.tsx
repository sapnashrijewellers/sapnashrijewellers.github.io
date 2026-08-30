"use client"

import { Suspense } from "react"
import JewelrySearch from "./SearchPage"

export default function SearchWrapper() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <JewelrySearch />
    </Suspense>
  )
}