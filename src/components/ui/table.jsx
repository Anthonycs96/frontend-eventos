import React from "react"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <table ref={ref} className={`w-full text-sm text-left text-gray-500 ${className}`} {...props} />
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={`text-xs text-gray-700 uppercase bg-gray-50 ${className}`} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={`bg-white border-b hover:bg-gray-50 ${className}`} {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th ref={ref} scope="col" className={`px-6 py-3 ${className}`} {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={`px-6 py-4 ${className}`} {...props} />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }

