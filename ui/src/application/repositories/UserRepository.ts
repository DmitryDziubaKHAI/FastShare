import { User } from "@/domain/models/user.ts";

export class UserRepository {
  url = "/signup";  

  async registerUser(user: User): Promise<Response> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response; 
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error; 
    }
  }
}

