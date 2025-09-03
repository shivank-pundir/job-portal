import { Webhook } from "svix";
import User from "../models/user.js";

//API controller function to manage clark User with database
export const clerkWebhook = async (req, res) => {
  try {
    const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //Verifying Haders
    await Whook.verify(JSON.stringify(req.body)),
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      };

    //Getting data from req body
    const { data, type } = req.body;

    // Switch cases for different Event

    switch (type) {
      case "user.created": {

        const userData = {
                  _id:data.id,
                email:data.email_addresses[0].email_addresses,
                name:data.first_name + " " + data.last_name,
                image: data.image_url,
                resume: ''
             }
             await User.create(userData)
             res.json({})
             break;

      }

      case "user.updated": {
         const userData = {
                  
                email:data.email_addresses[0].email_addresses,
                name:data.first_name + " " + data.last_name,
                image: data.image_url,
            
             }
             await User.findByIdAndUpdate(data.id, userData)
             res.json({})
             break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }
  } catch(error) {
    console.log(error.message);
    res.json({success:false, message:'Webhook Error'})
  }
};
