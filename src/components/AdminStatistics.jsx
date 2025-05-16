import { useState, useEffect, useContext } from "react";

import {
  fetchCategories,
  fetchSituations,
  fetchExcuses,
  fetchReviews,
} from "../utils/api";
import { getRegisteredUsers } from "../utils/auth";
import { AuthContext } from "./AuthContext";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import classes from "./AdminStatistics.module.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

export default function AdminStatistics() {
  const { user, openLoginModal } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [situations, setSituations] = useState([]);
  const [excuses, setExcuses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ users: 0, avgRating: 0 });
  const [ratingDist, setRatingDist] = useState([]);
  const [topExcuses, setTopExcuses] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [worstExcuses, setWorstExcuses] = useState([]);

  useEffect(() => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (user.role !== "admin") return;

    async function load() {
      const [catsRes, sitsRes, exsRes, revsRes] = await Promise.all([
        fetchCategories(),
        fetchSituations(),
        fetchExcuses(),
        fetchReviews(),
      ]);
      const catList = catsRes.categories || catsRes;
      const sitList = sitsRes.situations || sitsRes;
      const excList = exsRes.excuses || exsRes;
      const revList = revsRes.reviews || revsRes;
      const userList = getRegisteredUsers();

      setCategories(catList);
      setSituations(sitList);
      setExcuses(excList);
      setReviews(revList);

      // Basic stats
      const totalUsers = userList.length;
      const avgRating = revList.length
        ? (revList.reduce((s, r) => s + r.rating, 0) / revList.length).toFixed(
            1
          )
        : 0;
      setStats({ users: totalUsers, avgRating });

      // Rating distribution
      const dist = [1, 2, 3, 4, 5].map((r) => ({
        name: `${r}★`,
        value: revList.filter((x) => x.rating === r).length,
      }));
      setRatingDist(dist);

      // Top 5 most-reviewed excuses
      const countByExcuse = revList.reduce((acc, r) => {
        acc[r.excuseId] = (acc[r.excuseId] || 0) + 1;
        return acc;
      }, {});
      const topEx = Object.entries(countByExcuse)
        .map(([id, count]) => {
          const e = excList.find((ex) => ex.id === +id);
          return {
            name: e ? e.excuseDescription.slice(0, 20) + "…" : id,
            count,
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopExcuses(topEx);

      // Top 3 most-popular excuse categories
      const countByCat = revList.reduce((acc, r) => {
        const ex = excList.find((e) => e.id === r.excuseId);
        const sit = sitList.find((s) => s.id === ex?.situationId);
        const cat = catList.find((c) => c.id === sit?.categoryId);
        if (cat) acc[cat.id] = (acc[cat.id] || 0) + 1;
        return acc;
      }, {});
      const topCat = Object.entries(countByCat)
        .map(([id, count]) => ({
          id: +id,
          name: catList.find((c) => c.id === +id)?.categoryName || id,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      setTopCategories(topCat);

      // Users with highest number of reviews
      const countByUser = revList.reduce((acc, r) => {
        acc[r.userName] = (acc[r.userName] || 0) + 1;
        return acc;
      }, {});
      const topUsr = Object.entries(countByUser)
        .map(([username, count]) => ({ username, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      setTopUsers(topUsr);

      // Excuses with lowest average rating (bottom 3)
      const ratingsByExc = revList.reduce((acc, r) => {
        if (!acc[r.excuseId]) acc[r.excuseId] = [];
        acc[r.excuseId].push(r.rating);
        return acc;
      }, {});
      const worstEx = Object.entries(ratingsByExc)
        .map(([id, arr]) => {
          const avg = (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1);
          const e = excList.find((ex) => ex.id === +id);
          return {
            name: e ? e.excuseDescription.slice(0, 20) + "…" : id,
            avgRating: avg,
          };
        })
        .sort((a, b) => a.avgRating - b.avgRating)
        .slice(0, 3);
      setWorstExcuses(worstEx);
    }
    load().catch((err) => console.error(err));
  }, [user, openLoginModal]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className={classes.container}>
      <h1>The overall statistics</h1>
      {/* Key metric cards */}
      <div className={classes.cardGrid}>
        {/** Categories, Situations, Excuses, Users, Avg Rating **/}
        <div className={classes.card}>
          <div className={classes.value}>{categories.length}</div>
          <div className={classes.label}>Categories</div>
        </div>
        <div className={classes.card}>
          <div className={classes.value}>{situations.length}</div>
          <div className={classes.label}>Situations</div>
        </div>
        <div className={classes.card}>
          <div className={classes.value}>{excuses.length}</div>
          <div className={classes.label}>Excuses</div>
        </div>
        <div className={classes.card}>
          <div className={classes.value}>{stats.users}</div>
          <div className={classes.label}>Users</div>
        </div>
        <div className={classes.card}>
          <div className={classes.value}>{stats.avgRating}</div>
          <div className={classes.label}>Avg. Rating</div>
        </div>
      </div>
      {/* Charts */}
      <div className={classes.section}>
        <div className={classes.chartContainer}>
          <h3 className={classes.chartTitle}>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ratingDist}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {ratingDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={classes.chartContainer}>
          <h3 className={classes.chartTitle}>Top 5 Reviewed Excuses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={topExcuses}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <ReTooltip />
              <Bar dataKey="count" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lists */}
      <div className={classes.section}>
        <div className={classes.listSection}>
          <h3 className={classes.listTitle}>Top 3 Categories</h3>
          <ul className={classes.scrollList}>
            {topCategories.map((cat) => (
              <li key={cat.id}>
                {cat.name} ({cat.count})
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.listSection}>
          <h3 className={classes.listTitle}>Top 3 Users</h3>
          <ul className={classes.scrollList}>
            {topUsers.map((u) => (
              <li key={u.username}>
                {u.username} ({u.count})
              </li>
            ))}
          </ul>
        </div>
        <div className={classes.listSection}>
          <h3 className={classes.listTitle}>Lowest Rated Excuses</h3>
          <ul className={classes.scrollList}>
            {worstExcuses.map((e, i) => (
              <li key={i}>
                {e.name} ({e.avgRating}★)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
