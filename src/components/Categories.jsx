import classes from "./Categories.module.css";

function Categories() {
  return (
    <>
      <div className={classes.categories}>
        <div className={classes.category}>
          <p>Category 1: Family</p>
          <div className={classes.cardRow}>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
          </div>
        </div>
        <div className={classes.category}>
          <p>Category 2: Work</p>
          <div className={classes.cardRow}>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
          </div>
        </div>
        <div className={classes.category}>
          <p>Category 3: Relationship</p>
          <div className={classes.cardRow}>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
          </div>
        </div>
        <div className={classes.category}>
          <p>Category 4: Financial</p>
          <div className={classes.cardRow}>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
            <div className={classes.card}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
