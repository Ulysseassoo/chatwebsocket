import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let body: string | FormData;

    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      body = JSON.stringify(await request.json());
    }

    const response = await fetch('http://localhost:4000/users/profile', {
      method: 'PATCH',
      headers: {
        Authorization: token,
        ...(contentType.includes('multipart/form-data') 
          ? {} 
          : { 'Content-Type': 'application/json' }),
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 