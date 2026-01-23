export interface Order {
  orderId: number;
  items: Product[];
  amount: number;
  createAt: DateTime;
  status:string;
  shippingAWB:string;  
  events:OrderEvent[];
}
export interface Product{
    productId:Number,
    variant:number,
    price:Number
}
export interface OrderEvent{
    event:string;
    eventTime:Datetime;
}

export interface cart{
    items: Product[];
    total:number;
}
export interface userProfile{
    userId: string,
    email:string,    
    mobile:Number,
    address:string,
    city:string,
    pin:number
}

export async function createOrder(request, env, headers) {
    const body = await request.json();

    // Validate payload
    if (!body || !body.endpoint) {
        return new Response(
            JSON.stringify({ error: "Missing or invalid subscription object" }),
            { headers, status: 400 }
        );
    }

    const key = body.userid;
    const order = new {
        orderID: new GUID(),
        createdTime: new Datetime(),
        products: body.products,
        status:"new"
    }
    //add order created event
    let orders = env.USER_ORDER.put(body.userid);
    orders.push(order);

//delete order which are expired

//in case of multiple order with status == new, keep the latest only

    env.USER_ORDER.put(body.userid, JSON.stringify(order));
    return new Response(JSON.stringify({ message: "Subscribed successfully" }), {
        headers,
        body: orders,
        status: 201,
    });
}

export function placeOrder(request, env, headers) {
    if (!body || !body.endpoint) {
        return new Response(
            JSON.stringify({ error: "Missing or invalid subscription object" }),
            { headers, status: 400 }
        );
    }

    const key = body.userid;
    let order = env.USER_ORDER.get(body.userid, JSON.stringify(order));
    order.status ="payment-pending";
    //remove item from cart
    env.USER_ORDER.put(body.userid, JSON.stringify(order));
}

export function getOrders(request, env, headers) {
if (!body || !body.endpoint) {
        return new Response(
            JSON.stringify({ error: "Missing or invalid subscription object" }),
            { headers, status: 400 }
        );
    }

    const key = body.userid;

    let orders = env.USER_ORDER.get(body.userid);

    orders = orderCleanUp(orders);

    return new Response(JSON.stringify({ message: "Subscribed successfully" }), {
        headers,
        body: orders,
        status: 201,
    });
}

export function updateOrders(request, env, headers) {
if (!body || !body.endpoint) {
        return new Response(
            JSON.stringify({ error: "Missing or invalid  object" }),
            { headers, status: 400 }
        );
    }

    const key = body.userid;
    
    let orders = env.USER_ORDER.get(body.userid);

    orders = orderCleanUp(orders);

    //update order from body
    //orders = body.orders; // just update status

    return new Response(JSON.stringify({ message: "successful!!" }), {
        headers,
        body: orders,
        status: 201,
    });
}

function orderCleanUp(orders)
{
    //delete order which are expired

    //in case of multiple order with status == new, keep the latest only
}