// "use client"

// import * as React from "react"
// import {
//   closestCenter,
//   DndContext,
//   KeyboardSensor,
//   MouseSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
//   type UniqueIdentifier,
// } from "@dnd-kit/core"
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
// import {
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
//   IconCircleCheckFilled,
//   IconDotsVertical,
//   IconGripVertical,
//   IconLayoutColumns,
//   IconLoader,
//   IconPlus,
//   IconTrendingUp,
// } from "@tabler/icons-react"
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   Row,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
// import { toast } from "sonner"
// import { z } from "zod"

// import { useIsMobile } from "@/app/hooks/use-mobile"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"

// export const schema = z.object({
//   id: z.number(),
//   header: z.string(),
//   type: z.string(),
//   status: z.string(),
//   target: z.string(),
//   limit: z.string(),
//   reviewer: z.string(),
//   date: z.string(),
//   price: z.number(),

// })

// // Create a separate component for the drag handle
// function DragHandle({ id }: { id: number }) {
//   const { attributes, listeners } = useSortable({
//     id,
//   })

//   return (
//     <Button
//       {...attributes}
//       {...listeners}
//       variant="ghost"
//       size="icon"
//       className="text-muted-foreground size-7 hover:bg-transparent"
//     >
//       <IconGripVertical className="text-muted-foreground size-3" />
//       <span className="sr-only">Drag to reorder</span>
//     </Button>
//   )
// }

// // All the Table columns 
// const columns: ColumnDef<z.infer<typeof schema>>[] = [
//   {
//     id: "drag",
//     header: () => null,
//     cell: ({ row }) => <DragHandle id={row.original.id} />,
//   },
//   {
//     id: "select",
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       </div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "name",
//     header: "Course Name",
//     cell: ({ row }) => <TableCellViewer item={row.original} />,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "reviewer",
//     header: "Instructor",
//     cell: ({ row }) => {
//       const isAssigned = row.original.reviewer !== "Assign reviewer"

//       if (isAssigned) {
//         return row.original.reviewer
//       }

//       return (
//         <>
//           <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
//             Reviewer
//           </Label>
//           <Select>
//             <SelectTrigger
//               className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
//               // size="sm"
//               id={`${row.original.id}-reviewer`}
//             >
//               <SelectValue placeholder="Assign reviewer" />
//             </SelectTrigger>
//             <SelectContent align="end">
//               <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//               <SelectItem value="Jamik Tashpulatov">
//                 Jamik Tashpulatov
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </>
//       )
//     },
//   },
//   {
//     accessorKey: "date",
//     header: "Added Date",
//     cell: ({ row }) => row.original.date,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <Badge variant="outline" className="text-muted-foreground px-1.5">
//         {row.original.status === "Done" ? (
//           <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
//         ) : (
//           <IconLoader />
//         )}
//         {row.original.status}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//     cell: ({ row }) => row.original.type,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "price",
//     header: "Price",
//     cell: ({ row }) => `$${row.original.price}`,
//   },
//   {
//     id: "actions",
//     cell: () => (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
//             size="icon"
//           >
//             <IconDotsVertical />
//             <span className="sr-only">Open menu</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-32">
//           <DropdownMenuItem>Edit</DropdownMenuItem>
//           <DropdownMenuItem>Make a copy</DropdownMenuItem>
//           <DropdownMenuItem>Favorite</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>Delete</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     ),
//   },
// ]

// // Draggable Row
// function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
//   const { transform, transition, setNodeRef, isDragging } = useSortable({
//     id: row.original.id,
//   })

//   return (
//     <TableRow
//       data-state={row.getIsSelected() && "selected"}
//       data-dragging={isDragging}
//       ref={setNodeRef}
//       className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition: transition,
//       }}
//     >
//       {row.getVisibleCells().map((cell) => (
//         <TableCell key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   )
// }

// // The Table
// export function DataTable({
//   data: initialData,
// }: {
//   data: z.infer<typeof schema>[]
// }) {
//   const [data, setData] = React.useState(() => initialData)
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({})
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   )
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   })
//   const sortableId = React.useId()
//   const sensors = useSensors(
//     useSensor(MouseSensor, {}),
//     useSensor(TouchSensor, {}),
//     useSensor(KeyboardSensor, {})
//   )

//   const dataIds = React.useMemo<UniqueIdentifier[]>(
//     () => data?.map(({ id }) => id) || [],
//     [data]
//   )

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination,
//     },
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event
//     if (active && over && active.id !== over.id) {
//       setData((data) => {
//         const oldIndex = dataIds.indexOf(active.id)
//         const newIndex = dataIds.indexOf(over.id)
//         return arrayMove(data, oldIndex, newIndex)
//       })
//     }
//   }

//   return (
//     <Tabs
//       defaultValue="outline"
//       className="w-full justify-start gap-6 px-6"
//     >
//       {/* The above tabs */}
//       <div className="flex items-center justify-between lg:px-0">
//         <Label htmlFor="view-selector" className="sr-only">
//           View
//         </Label>

//         {/* Customization Column */}
//         <div className="flex items-center justify-items-center gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <IconLayoutColumns />
//                 <span className="hidden lg:inline">Customize Columns</span>
//                 <span className="lg:hidden">Columns</span>
//                 <IconChevronDown />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               {table
//                 .getAllColumns()
//                 .filter(
//                   (column) =>
//                     typeof column.accessorFn !== "undefined" &&
//                     column.getCanHide()
//                 )
//                 .map((column) => {
//                   return (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) =>
//                         column.toggleVisibility(!!value)
//                       }
//                     >
//                       {column.id}
//                     </DropdownMenuCheckboxItem>
//                   )
//                 })}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Add Section Button */}
//           <Button variant="outline" size="sm">
//             <IconPlus />
//             <span className="hidden lg:inline">Add Section</span>
//           </Button>
//         </div>
//       </div>

//       {/* Main Table data */}
//       <TabsContent
//         value="outline"
//         className="relative"
//       >

//         {/* Table with Drag-and-Drop, Filtering, Sorting, Pagination */}
//         <div className="overflow-hidden rounded-lg border">

//           {/* Dnd-enabled Table */}
//           <DndContext
//             collisionDetection={closestCenter}
//             modifiers={[restrictToVerticalAxis]}
//             onDragEnd={handleDragEnd}
//             sensors={sensors}
//             id={sortableId}
//           >
//             <Table>
//               <TableHeader className="bg-muted sticky top-0 z-10">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => {
//                       return (
//                         <TableHead key={header.id} colSpan={header.colSpan}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                         </TableHead>
//                       )
//                     })}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody className="**:data-[slot=table-cell]:first:w-8">
//                 {table.getRowModel().rows?.length ? (
//                   <SortableContext
//                     items={dataIds}
//                     strategy={verticalListSortingStrategy}
//                   >
//                     {table.getRowModel().rows.map((row) => (
//                       <DraggableRow key={row.id} row={row} />
//                     ))}
//                   </SortableContext>
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </DndContext>
//         </div>

//         {/* Table's Footer Section - Pagination */}
//         <div className="flex items-center justify-between px-4 mt-3">
//           <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
//             {table.getFilteredSelectedRowModel().rows.length} of{" "}
//             {table.getFilteredRowModel().rows.length} row(s) selected.
//           </div>
//           <div className="flex w-full items-center gap-8 lg:w-fit">
//             <div className="hidden items-center gap-2 lg:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Rows per page
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value: any) => {
//                   table.setPageSize(Number(value))
//                 }}
//               >
//                 <SelectTrigger
//                   // size="sm" 
//                   className="w-20"
//                   id="rows-per-page">
//                   <SelectValue
//                     placeholder={table.getState().pagination.pageSize}
//                   />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[10, 20, 30, 40, 50].map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex w-fit items-center justify-center text-sm font-medium">
//               Page {table.getState().pagination.pageIndex + 1} of{" "}
//               {table.getPageCount()}
//             </div>
//             <div className="ml-auto flex items-center gap-2 lg:ml-0">
//               <Button
//                 variant="outline"
//                 className="hidden h-8 w-8 p-0 lg:flex"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 <span className="sr-only">Go to first page</span>
//                 <IconChevronsLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 <span className="sr-only">Go to previous page</span>
//                 <IconChevronLeft />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 <span className="sr-only">Go to next page</span>
//                 <IconChevronRight />
//               </Button>
//               <Button
//                 variant="outline"
//                 className="hidden size-8 lg:flex"
//                 size="icon"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}
//               >
//                 <span className="sr-only">Go to last page</span>
//                 <IconChevronsRight />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </TabsContent>

//     </Tabs>
//   )
// }

// Onclicking on the header cell a form open right to left 
// function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
//   const isMobile = useIsMobile()

//   return (
//     <Drawer direction={isMobile ? "bottom" : "right"}>
//       <DrawerTrigger asChild>
//         <Button variant="link" className="text-foreground w-fit px-0 text-left">
//           {item.header}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="gap-1">
//           <DrawerTitle>{item.header}</DrawerTitle>
//           <DrawerDescription>
//             Showing total visitors for the last 6 months
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
//           {!isMobile && (
//             <>
//               <Separator />
//               <div className="grid gap-2">
//                 <div className="flex gap-2 leading-none font-medium">
//                   Trending up by 5.2% this month{" "}
//                   <IconTrendingUp className="size-4" />
//                 </div>
//                 <div className="text-muted-foreground">
//                   Showing total visitors for the last 6 months. This is just
//                   some random text to test the layout. It spans multiple lines
//                   and should wrap around.
//                 </div>
//               </div>
//               <Separator />
//             </>
//           )}
//           <form className="flex flex-col gap-4">
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="header">Header</Label>
//               <Input id="header" defaultValue={item.header} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="type">Type</Label>
//                 <Select defaultValue={item.type}>
//                   <SelectTrigger id="type" className="w-full">
//                     <SelectValue placeholder="Select a type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Table of Contents">
//                       Table of Contents
//                     </SelectItem>
//                     <SelectItem value="Executive Summary">
//                       Executive Summary
//                     </SelectItem>
//                     <SelectItem value="Technical Approach">
//                       Technical Approach
//                     </SelectItem>
//                     <SelectItem value="Design">Design</SelectItem>
//                     <SelectItem value="Capabilities">Capabilities</SelectItem>
//                     <SelectItem value="Focus Documents">
//                       Focus Documents
//                     </SelectItem>
//                     <SelectItem value="Narrative">Narrative</SelectItem>
//                     <SelectItem value="Cover Page">Cover Page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="status">Status</Label>
//                 <Select defaultValue={item.status}>
//                   <SelectTrigger id="status" className="w-full">
//                     <SelectValue placeholder="Select a status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Done">Done</SelectItem>
//                     <SelectItem value="In Progress">In Progress</SelectItem>
//                     <SelectItem value="Not Started">Not Started</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="target">Target</Label>
//                 <Input id="target" defaultValue={item.target} />
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="limit">Limit</Label>
//                 <Input id="limit" defaultValue={item.limit} />
//               </div>
//             </div>
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="reviewer">Reviewer</Label>
//               <Select defaultValue={item.reviewer}>
//                 <SelectTrigger id="reviewer" className="w-full">
//                   <SelectValue placeholder="Select a reviewer" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//                   <SelectItem value="Jamik Tashpulatov">
//                     Jamik Tashpulatov
//                   </SelectItem>
//                   <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </form>
//         </div>
//         <DrawerFooter>
//           <Button>Submit</Button>
//           <DrawerClose asChild>
//             <Button variant="outline">Done</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   )
// }


"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"

// Generic interfaces for reusability
export interface BaseTableItem {
  id: number | string
  [key: string]: any
}

export interface TableAction {
  label: string
  action: string // Use action identifier instead of function
  variant?: 'default' | 'destructive'
}

// Column configuration interface - serializable
export interface ColumnConfig<TItem extends BaseTableItem = BaseTableItem> {
  key: string;
  header: string;
  type?: 'text' | 'badge' | 'select' | 'date' | 'price' | 'custom';
  enableHiding?: boolean;
  enableSorting?: boolean;
  width?: number;

  // For select type
  selectOptions?: { value: string; label: string }[];
  selectPlaceholder?: string;

  // For badge type
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  badgeConditions?: { condition: (value: any) => boolean; variant: string; icon?: React.ReactNode }[];

  // For custom rendering
  render?: (item: TItem) => React.ReactNode;
}


export interface DataTableProps<T extends BaseTableItem> {
  data: T[]
  columns: ColumnConfig<T>[]
  // Optional configurations
  enableDragAndDrop?: boolean
  enableSelection?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  defaultPageSize?: number
  pageSizeOptions?: number[]
  // Event handlers
  onDataChange?: (newData: T[]) => void
  onRowClick?: (item: T) => void
  onActionClick?: (action: string, item: T) => void
  customActions?: TableAction[]
  // UI customization
  showAddButton?: boolean
  addButtonLabel?: string
  onAddClick?: () => void
  showCustomizeColumns?: boolean
  className?: string
}

// Drag handle component
function DragHandle<T extends BaseTableItem>({ id }: { id: T['id'] }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Draggable row component
function DraggableRow<T extends BaseTableItem>({ 
  row, 
  onRowClick 
}: { 
  row: Row<T>
  onRowClick?: (item: T) => void
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 cursor-pointer"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      onClick={() => onRowClick?.(row.original)}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// Helper function to create cell renderer based on column config
function createCellRenderer<T extends BaseTableItem>(config: ColumnConfig<T>) {
  return ({ row }: { row: Row<T> }) => {
    const value = row.original[config.key]
    
    switch (config.type) {
      case 'badge':
        if (config.badgeConditions) {
          const condition = config.badgeConditions.find(c => c.condition(value))
          if (condition) {
            return (
              <div className="flex items-center gap-2">
                {condition.icon}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  condition.variant === 'destructive' ? 'bg-red-100 text-red-800' :
                  condition.variant === 'default' ? 'bg-blue-100 text-blue-800' :
                  condition.variant === 'secondary' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800 border'
                }`}>
                  {value}
                </span>
              </div>
            )
          }
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            config.badgeVariant === 'destructive' ? 'bg-red-100 text-red-800' :
            config.badgeVariant === 'default' ? 'bg-blue-100 text-blue-800' :
            config.badgeVariant === 'secondary' ? 'bg-gray-100 text-gray-800' :
            'bg-gray-100 text-gray-800 border'
          }`}>
            {value}
          </span>
        )
      
      case 'select':
        const isAssigned = value && value !== config.selectPlaceholder
        if (isAssigned) {
          return value
        }
        return (
          <Select>
            <SelectTrigger className="w-38">
              <SelectValue placeholder={config.selectPlaceholder || "Select option"} />
            </SelectTrigger>
            <SelectContent align="end">
              {config.selectOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case 'price':
        return `$${typeof value === 'number' ? value.toLocaleString() : value}`
      
      case 'date':
        return new Date(value).toLocaleDateString()
      
      case 'custom':
        return config.render ? config.render(row.original) : value
      
      default:
        return value
    }
  }
}

// Helper function to create standard columns
export function createStandardColumns<T extends BaseTableItem>(
  enableDragAndDrop: boolean = true,
  enableSelection: boolean = true,
  customActions?: TableAction[],
  onActionClick?: (action: string, item: T) => void
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = []

  if (enableDragAndDrop) {
    columns.push({
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
      size: 40,
    })
  }

  if (enableSelection) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    })
  }

  if (customActions && customActions.length > 0) {
    columns.push({
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {customActions.map((action, index) => (
              <React.Fragment key={action.action}>
                <DropdownMenuItem 
                  onClick={() => onActionClick?.(action.action, row.original)}
                  className={action.variant === 'destructive' ? 'text-destructive' : ''}
                >
                  {action.label}
                </DropdownMenuItem>
                {index < customActions.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 40,
    })
  }

  return columns
}

// Main reusable DataTable component
export function ReusableDataTable<T extends BaseTableItem>({
  data: initialData,
  columns: columnConfigs,
  enableDragAndDrop = true,
  enableSelection = true,
  enableColumnVisibility = true,
  enablePagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onDataChange,
  onRowClick,
  onActionClick,
  customActions,
  showAddButton = true,
  addButtonLabel = "Add Item",
  onAddClick,
  showCustomizeColumns = true,
  className = "",
}: DataTableProps<T>) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataColumns: ColumnDef<T>[] = React.useMemo(() => 
    columnConfigs.map((config) => ({
      id: config.key,
      accessorKey: config.key,
      header: config.header,
      cell: createCellRenderer<T>(config),
      enableHiding: config.enableHiding !== false,
      enableSorting: config.enableSorting !== false,
      size: config.width,
    })), [columnConfigs]
  )

  const standardColumns = React.useMemo(() => 
    createStandardColumns<T>(
      enableDragAndDrop, 
      enableSelection, 
      customActions,
      onActionClick
    ), [enableDragAndDrop, enableSelection, customActions, onActionClick]
  )

  const columns = React.useMemo(() => 
    [...standardColumns, ...dataColumns], 
    [standardColumns, dataColumns]
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return
    
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        const newData = arrayMove(prevData, oldIndex, newIndex)
        onDataChange?.(newData)
        return newData
      })
    }
  }

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const TableComponent = (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {table.getRowModel().rows?.length ? (
            enableDragAndDrop ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} onRowClick={onRowClick} />
                ))}
              </SortableContext>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <Tabs defaultValue="outline" className={`w-full justify-start gap-6 px-6 ${className}`}>
      <div className="flex items-center justify-between lg:px-0">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <div className="flex items-center justify-items-center gap-2">
          {showCustomizeColumns && enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showAddButton && (
            <Button variant="outline" size="sm" onClick={onAddClick}>
              <IconPlus />
              <span className="hidden lg:inline">{addButtonLabel}</span>
            </Button>
          )}
        </div>
      </div>

      <TabsContent value="outline" className="relative">
        {enableDragAndDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            {TableComponent}
          </DndContext>
        ) : (
          TableComponent
        )}

        {enablePagination && (
          <div className="flex items-center justify-between px-4 mt-3">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20" id="rows-per-page">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {pageSizeOptions.map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

