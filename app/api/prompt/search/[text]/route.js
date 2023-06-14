import Prompt from "@models/prompt"
import User from "@models/user"
import { connectToDB } from "@utils/database"


export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        // const prompts = await Prompt.find({
        //     $or: [
        //         {tag: {$regex: params.text, $options: 'i'}},
        //         {prompt: {$regex: params.text, $options: 'i'}},
        //     ]
        // }).populate('creator')


        const prompts = await Prompt.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creator'
            }},
            {
                $set: {creator: {$last: "$creator"}}
            },
            {
                $match: {
                    $or: [
                        {tag: {$regex: params.text, $options: 'i'}},
                        {prompt: {$regex: params.text, $options: 'i'}},
                        {'creator.username': {$regex: params.text, $options: 'i'}}
                    ]
                }
            }
            
        ]).exec()

        // console.log(JSON.stringify(prompts2));

        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response('Failed to fetch prompts', { status: 500 })
    }
}