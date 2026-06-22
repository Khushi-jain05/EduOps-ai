exports.createChat = async (req,res)=>{
  res.json({message:"createChat works"});
};

exports.getChats = async (req,res)=>{
  res.json([]);
};

exports.getMessages = async (req,res)=>{
  res.json([]);
};

exports.sendMessage = async (req,res)=>{
  try {

    const { message } = req.body;

    console.log("MESSAGE =>", message);

    return res.status(200).json({
      assistant:{
        role:"assistant",
        content:`Backend connected successfully. You said: ${message}`
      }
    });

  } catch(error){

    console.log(error);

    return res.status(500).json({
      message:"Server Error"
    });
  }
};