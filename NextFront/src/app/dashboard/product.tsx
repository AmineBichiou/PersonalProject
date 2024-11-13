import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Transfer } from '@/lib/db'; // Adjusted type import
import { deleteTransferById } from '@/lib/db'; // Adjusted import for delete function
import { useRouter } from 'next/navigation';

export function Product({ product }: { product: Transfer }) {
  const router = useRouter(); // Use router for navigation

  const handleDelete = async (id: string) => {
    try {
      await deleteTransferById(id);
      router.refresh(); // Refresh the page after deletion
    } catch (error) {
      console.error("Failed to delete the product:", error);
      // Handle error notification if needed
    }
  };

  // Parse dateTime to Date object
  const dateTime = new Date(product.dateTime);
  const date = dateTime.toLocaleDateString("en-US");
  const time = dateTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={'/default-image.png'} // Ensure to handle imageUrl
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{product.client.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {product.status ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${product.options}`}</TableCell>
      <TableCell className="hidden md:table-cell">{product.isCompleted ? 'Completed' : 'Pending'}</TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>
      <TableCell className="hidden md:table-cell">{time}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <Button onClick={() => handleDelete(product._id.toString())} variant="destructive">
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
