import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getOrderById } from "@/lib/services/order.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Order Confirmed</h1>
        <p className="mt-2 text-zinc-600">Mock payment completed successfully.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order {order.id}</CardTitle>
            <Badge variant="success">{order.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-zinc-500">
                  {item.quantity} x {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <span className="font-medium">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Back to shop
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
