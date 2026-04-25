import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import ChannelCard from "./ChannelCard";
import Videos from "./Videos";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const ChannelDetail = () => {
  const { id } = useParams();

  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await fetchFromAPI(
          `channels?part=snippet&id=${id}`
        );
        setChannelDetail(data?.items?.[0] || null);

        const videosData = await fetchFromAPI(
          `search?channelId=${id}&part=snippet&type=video&order=date`
        );
        setVideos(videosData?.items || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Box minHeight="95vh">
      <Box>
        <div
          style={{
            height: "300px",
            background:
              "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
          }}
        />
        {channelDetail && (
          <ChannelCard channelDetail={channelDetail} marginTop="-93px" />
        )}
      </Box>

      <Box display="flex" p={2}>
        <Box sx={{ mr: { sm: "100px" } }} />
        <Videos videos={videos} />
      </Box>
    </Box>
  );
};

export default ChannelDetail;