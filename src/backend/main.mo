import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Stack "mo:core/Stack";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Article
  type Article = {
    id : Nat;
    title : Text;
    summary : Text;
    body : Text;
    category : Text;
    author : Text;
    imageUrl : Text;
    publishedAt : Int;
    isPublished : Bool;
  };

  module Article {
    public func compare(a1 : Article, a2 : Article) : Order.Order {
      Int.compare(a2.publishedAt, a1.publishedAt);
    };
  };

  // Storage
  var nextId = 1;
  let articles = Map.empty<Nat, Article>();

  // Initialize with sample articles
  system func preupgrade() {
    let now = Time.now();
    let sampleArticles = [
      {
        id = 1;
        title = "Global Markets Rally";
        summary = "Stocks surge worldwide as economic outlook brightens.";
        body = "Stocks worldwide experienced significant gains today as economic indicators pointed to a more optimistic future. Analysts attribute the rally to strong corporate earnings and positive employment data, signaling a possible recovery from recent downturns. Investors remain cautious but hopeful as markets continue their upward trajectory.";
        category = "World";
        author = "admin";
        imageUrl = "https://example.com/markets.jpg";
        publishedAt = now - 86400000 * 1;
        isPublished = true;
      },
      {
        id = 2;
        title = "Election Results Surprise";
        summary = "Unexpected political shifts in the latest elections.";
        body = "The latest election results have taken many by surprise, with unexpected gains for several minority parties. Political analysts are examining the implications for future policy changes and the stability of the current government. Voter turnout was higher than anticipated, reflecting increased public interest in the political process.";
        category = "Politics";
        author = "admin";
        imageUrl = "https://example.com/elections.jpg";
        publishedAt = now - 86400000 * 2;
        isPublished = true;
      },
      {
        id = 3;
        title = "Tech Giants Unveil Innovations";
        summary = "Major technology companies announce breakthrough products.";
        body = "Technology giants unveiled a range of innovative products at this year's tech conference, including advances in artificial intelligence, virtual reality, and smart devices. Industry experts predict these developments will drive significant growth in the tech sector and change the way consumers interact with technology.";
        category = "Technology";
        author = "admin";
        imageUrl = "https://example.com/tech.jpg";
        publishedAt = now - 86400000 * 3;
        isPublished = true;
      },
      {
        id = 4;
        title = "Championship Game Thrills Fans";
        summary = "Exciting finish to the annual sports championship.";
        body = "Fans were on the edge of their seats during the thrilling conclusion of the annual sports championship. The underdog team secured a last-minute victory, sparking celebrations across the city. Sports commentators are calling it one of the most memorable games in recent history.";
        category = "Sports";
        author = "admin";
        imageUrl = "https://example.com/sports.jpg";
        publishedAt = now - 86400000 * 4;
        isPublished = true;
      },
      {
        id = 5;
        title = "Celebrity Launches Charity";
        summary = "Famous entertainer starts new philanthropic initiative.";
        body = "A popular celebrity announced the launch of a new charity organization aimed at supporting underprivileged children. The initiative has already garnered significant support from fans and fellow entertainers. The celebrity expressed hopes that the project will inspire others to contribute to important causes.";
        category = "Entertainment";
        author = "admin";
        imageUrl = "https://example.com/charity.jpg";
        publishedAt = now - 86400000 * 5;
        isPublished = true;
      },
      {
        id = 6;
        title = "Medical Breakthrough Announced";
        summary = "Scientists discover promising new treatment for disease.";
        body = "Researchers announced a medical breakthrough with the development of a promising new treatment for a rare disease. Initial clinical trials have shown positive results, offering hope to patients and their families. The medical community is optimistic about further advancements in this area.";
        category = "Science";
        author = "admin";
        imageUrl = "https://example.com/medical.jpg";
        publishedAt = now - 86400000 * 6;
        isPublished = true;
      },
      {
        id = 7;
        title = "New Environmental Policies";
        summary = "Governments implement stricter environmental regulations.";
        body = "Governments worldwide have implemented new environmental policies aimed at reducing carbon emissions and promoting sustainability. Environmental groups have praised these efforts, though some industries express concerns about the economic impact. Policymakers emphasize the importance of balancing economic growth with environmental protection.";
        category = "World";
        author = "admin";
        imageUrl = "https://example.com/environment.jpg";
        publishedAt = now - 86400000 * 7;
        isPublished = true;
      },
      {
        id = 8;
        title = "Innovative Startups Recognized";
        summary = "Promising new businesses win industry awards.";
        body = "Several innovative startups received industry awards for their groundbreaking products and services. Judges praised the winners for their creativity, technical expertise, and potential for long-term success. The recognition is expected to help these companies attract new customers and investors.";
        category = "Technology";
        author = "admin";
        imageUrl = "https://example.com/startups.jpg";
        publishedAt = now - 86400000 * 8;
        isPublished = true;
      }
    ];
    for (article in sampleArticles.values()) {
      articles.add(article.id, article);
    };
    nextId := 9;
  };

  // Article CRUD
  public shared ({ caller }) func createArticle(title : Text, summary : Text, body : Text, category : Text, author : Text, imageUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create articles.");
    };
    let article : Article = {
      id = nextId;
      title;
      summary;
      body;
      category;
      author;
      imageUrl;
      publishedAt = Time.now();
      isPublished = false;
    };
    articles.add(nextId, article);
    let id = nextId;
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateArticle(id : Nat, title : Text, summary : Text, body : Text, category : Text, author : Text, imageUrl : Text, isPublished : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update articles.");
    };
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?existing) {
        let updated : Article = {
          id;
          title;
          summary;
          body;
          category;
          author;
          imageUrl;
          publishedAt = existing.publishedAt;
          isPublished;
        };
        articles.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete articles.");
    };
    if (not articles.containsKey(id)) { Runtime.trap("Article not found") };
    articles.remove(id);
  };

  public query ({ caller }) func getArticle(id : Nat) : async ?Article {
    switch (articles.get(id)) {
      case (null) { null };
      case (?article) {
        // Only admins can view unpublished articles
        if (not article.isPublished and not AccessControl.isAdmin(accessControlState, caller)) {
          null;
        } else {
          ?article;
        };
      };
    };
  };

  public query ({ caller }) func listArticles(category : ?Text, searchText : ?Text) : async [Article] {
    articles.values().toArray().filter(
      func(article) {
        article.isPublished and matchesCategory(article, category) and matchesSearchText(article, searchText)
      }
    ).sort();
  };

  // Helper functions
  func matchesCategory(article : Article, category : ?Text) : Bool {
    switch (category) {
      case (null) { true };
      case (?cat) { Text.equal(article.category, cat) };
    };
  };

  func matchesSearchText(article : Article, searchText : ?Text) : Bool {
    switch (searchText) {
      case (null) { true };
      case (?text) {
        article.title.contains(#text text) or
        article.summary.contains(#text text) or
        article.body.contains(#text text)
      };
    };
  };
};
